package main

import (
	"bufio"
	"fmt"
	"os"
	// "regexp"
	"sort"
	"strings"

	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type TLPDB struct {
	root     string
	tlps     map[string]TLPOBJ
	verified int
}

type TLPOBJ struct {
	Name          string `json:"name"`
	Category      string `json:"category"`
	Shortdesc     string `json:"shortdesc"`
	Longdesc      string `json:"longdesc"`
	catalogue     string
	relocated     string
	runfiles      []string
	runsize       string
	srcfiles      []string
	srcsize       string
	docfiles      []string
	docsize       string
	executes      []string
	postactions   []string
	binfiles      map[string][]string
	binsize       map[string]string
	Depends       []string          `json:"depends"`
	Revision      string            `json:"revision"`
	Cataloguedata map[string]string `json:"cataloguedata"`
}

func (db *TLPDB) addTlpobj(tlp TLPOBJ) {
	db.tlps[tlp.Name] = tlp
}

func (db *TLPDB) fromFile(f string) {
	fp, err := os.Open(f)
	if err != nil {
		panic(err)
	}
	defer fp.Close()

	scanner := bufio.NewScanner(fp)
	for {
		tlp := TLPOBJ{
			binfiles:      make(map[string][]string),
			binsize:       make(map[string]string),
			Cataloguedata: make(map[string]string),
		}
		if !tlp.fromScaner(scanner, true) {
			break
		}

		//fmt.Printf("%-10s %s\n", "["+tlp.Category+"]", tlp.Name)

		db.addTlpobj(tlp)
	}
}

func (tlp *TLPOBJ) fromScaner(s *bufio.Scanner, multi bool) bool {
	started := false
	lastcmd := ""
	var arch string
	var size string

	for s.Scan() {
		line := s.Text()
		line = strings.Trim(line, "\n")

		if line != "" && line[0] == '#' {
			continue
		}

		if strings.Trim(line, " ") == "" {
			if !started {
				continue
			}
			if multi {
				return true
			}
		}

		splitted := strings.SplitN(line, " ", 2)
		cmd := splitted[0]
		arg := splitted[1]

		if cmd == "" {
			if lastcmd == "runfiles" {
				tlp.runfiles = append(tlp.runfiles, arg)
			} else if lastcmd == "srcfiles" {
				tlp.srcfiles = append(tlp.srcfiles, arg)
			} else if lastcmd == "docfiles" {
				argSplitted := strings.SplitN(arg, " ", 2)
				f := argSplitted[0]
				// rest := argSplitted[1]
				tlp.docfiles = append(tlp.docfiles, f)
			} else if lastcmd == "binfiles" {
				tlp.binfiles[arch] = append(tlp.binfiles[arch], arg)
			}
		} else if cmd == "longdesc" {
			if tlp.Longdesc == "" {
				tlp.Longdesc = arg
			} else {
				tlp.Longdesc = strings.Join([]string{tlp.Longdesc, arg}, " ")
			}
		} else if strings.HasPrefix(cmd, "catalogue-") {
			tlp.Cataloguedata[cmd[10:]] = arg
		} else if cmd == "docfiles" {
			for _, tag := range strings.Split(arg, " ") {
				tagSplitted := strings.SplitN(tag, "=", 2)
				k := tagSplitted[0]
				v := tagSplitted[1]
				if k == "size" {
					tlp.docsize = v
				}
			}
		} else if cmd == "srcfiles" {
			for _, tag := range strings.Split(arg, " ") {
				tagSplitted := strings.SplitN(tag, "=", 2)
				k := tagSplitted[0]
				v := tagSplitted[1]
				if k == "size" {
					tlp.srcsize = v
				}
			}
		} else if cmd == "runfiles" {
			for _, tag := range strings.Split(arg, " ") {
				tagSplitted := strings.SplitN(tag, "=", 2)
				k := tagSplitted[0]
				v := tagSplitted[1]
				if k == "size" {
					tlp.runsize = v
				}
			}
		} else if cmd == "name" {
			tlp.Name = arg
			started = true
		} else if cmd == "category" {
			tlp.Category = arg
		} else if cmd == "revision" {
			tlp.Revision = arg
		} else if cmd == "shortdesc" {
			if arg == "" {
				tlp.Shortdesc = " "
			} else {
				tlp.Shortdesc = arg
			}
		} else if cmd == "execute" {
			tlp.executes = append(tlp.executes, arg)
		} else if cmd == "postaction" {
			tlp.postactions = append(tlp.postactions, arg)
		} else if cmd == "depend" {
			tlp.Depends = append(tlp.Depends, arg)
		} else if cmd == "binfiles" {
			for _, tag := range strings.Split(arg, " ") {
				tagSplitted := strings.SplitN(tag, "=", 2)
				k := tagSplitted[0]
				v := tagSplitted[1]
				if k == "arch" {
					arch = v
				} else if k == "size" {
					size = v
				}
			}
			if size != "" {
				tlp.binsize[arch] = size
			}
		} else if cmd == "relocated" {
			tlp.relocated = arg
		} else if cmd == "catalogue" {
			tlp.catalogue = arg
		}
		if cmd != "" {
			lastcmd = cmd
		}
	}
	return started
}

func (tlp TLPOBJ) printInfo() {
	fmt.Printf("%-12s %s\n", "package:", tlp.Name)
	fmt.Printf("%-12s %s\n", "category:", tlp.Category)
	fmt.Printf("%-12s %s\n", "shortdesc:", tlp.Shortdesc)
	fmt.Printf("%-12s %s\n", "longdesc:", tlp.Longdesc)
	fmt.Printf("%-12s %s\n", "installed:", "?")
	fmt.Printf("%-12s %s\n", "revision:", tlp.Revision)
	fmt.Printf("%-12s run: %s, bin: %s\n", "sizes:", tlp.runsize, tlp.binsize)
	fmt.Printf("%-12s %s\n", "relocatable:", tlp.relocated)
	fmt.Printf("%-12s %s\n", "cat-version:", tlp.Cataloguedata["version"])
	fmt.Printf("%-12s %s\n", "cat-license:", tlp.Cataloguedata["license"])
	fmt.Printf("%-12s %s\n", "cat-topics:", tlp.Cataloguedata["topics"])
	fmt.Printf("%-12s %s\n", "cat-contact-repository:", tlp.Cataloguedata["contact-repository"])
	fmt.Printf("%-12s %s\n", "cat-contact-bugs:", tlp.Cataloguedata["contact-bugs"])
	fmt.Println()
}

func serve(db TLPDB, addr string) {
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./client/build", true)))
	router.NoRoute(func(c *gin.Context) {
		c.File("./client/build/index.html")
	})

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status": "Ok☃️",
			})
		})
		api.GET("/all", func(c *gin.Context) {
			keys := make([]string, 0)
			for k, _ := range db.tlps {
				keys = append(keys, k)
			}
			sort.Strings(keys)
			var all []gin.H
			for _, k := range keys {
				all = append(all, gin.H{
					"name":      db.tlps[k].Name,
					"category":  db.tlps[k].Category,
					"revision":  db.tlps[k].Revision,
					"shortdesc": db.tlps[k].Shortdesc,
				})
			}
			c.JSON(http.StatusOK, all)
		})
		api.GET("/tlp/:name", func(c *gin.Context) {
			if tlp, ok := db.tlps[c.Param("name")]; ok {
				c.JSON(http.StatusOK, tlp)
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid package name🍣️"})
			}
		})
	}

	// Start and run the server
	router.Run(addr)
}

func main() {
	db := TLPDB{
		tlps: make(map[string]TLPOBJ),
	}
	db.fromFile("./texlive.tlpdb")

	if len(os.Args) == 2 {
		db.tlps[os.Args[1]].printInfo()
		return
	}

	serve(db, ":5000")
}
