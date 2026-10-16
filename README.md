# Webhaus launch videos

Launch videos for the 8 Webhaus LLC sites listed on https://webhaus.info, built with [HyperFrames](https://github.com/heygen-com/hyperframes).

- **Finals:** `videos/final/` holds a 30s 16:9 master and a 15s 9:16 cut per site (01 sequoia … 08 familylawriverside). They have sound effects only, with no voiceover or music.
- **Projects:** `videos/<site>/` (16:9, composition `main`) and `videos/<site>-vertical/` (9:16, composition `vertical`). Each is its own HyperFrames project.
- **Brief and brand sheet:** `launch-video-concepts.md`. The site screenshots and extracted CSS are in `screenshots/`.
- **How the videos were built:** `videos/BUILD-GUIDE.md` covers the composition rules, the sound-effect placement and the verify/render steps.

To re-render a project:

```bash
cd videos/<project>
npx hyperframes check
npx hyperframes render -o renders/out.mp4 -q delivery
```

The renders need Chrome and ffmpeg. `node_modules/` and the render caches are not committed.
