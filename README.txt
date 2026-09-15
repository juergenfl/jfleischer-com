
Lokal starten:

$ cd ~/Dev/AI/truelab.ai
$ npm run dev

> jfleischer-com@0.1.0 dev
> vite


  VITE v8.3.0  ready in 88 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
18:02:15 [vite] (client) hmr update /src/components/Footer.tsx, /src/index.css
18:02:15 [vite] (client) hmr update /src/components/Hero.tsx, /src/index.css
18:02:15 [vite] (client) hmr update /src/components/Header.tsx, /src/index.css
18:02:15 [vite] (client) page reload index.html
^C

---

Ein Build erzeugen:

$ npm run build

> jfleischer-com@0.1.0 build
> tsc -b && vite build

vite v8.3.0 building client environment for production...
✓ 57 modules transformed.
computing gzip size...
dist/index.html                     0.94 kB │ gzip:   0.49 kB
dist/assets/index-BDQ8ljtp.css     19.13 kB │ gzip:   4.52 kB
dist/assets/index-DKqxu73d.js   1,191.49 kB │ gzip: 325.98 kB

✓ built in 242ms
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.

juergen@macbook:~/Dev/AI/truelab.ai $ ls dist
assets		favicon.svg	index.html
juergen@macbook:~/Dev/AI/truelab.ai $ find dist -ls
28188765        0 drwxr-xr-x    5 juergen          staff                 160 11 Sep. 18:29 dist
28261296        8 -rw-r--r--    1 juergen          staff                 944 11 Sep. 18:29 dist/index.html
28261293        0 drwxr-xr-x    4 juergen          staff                 128 11 Sep. 18:29 dist/assets
28261295       40 -rw-r--r--    1 juergen          staff               19134 11 Sep. 18:29 dist/assets/index-BDQ8ljtp.css
28261294     2328 -rw-r--r--    1 juergen          staff             1191496 11 Sep. 18:29 dist/assets/index-DKqxu73d.js
28261292        8 -rw-r--r--    1 juergen          staff                 268 11 Sep. 18:29 dist/favicon.svg

juergen@macbook:~/Dev/AI/truelab.ai $ cp DEPLOY.md ~/Obsidian/Deploy-jfleischer.com-Server.md

