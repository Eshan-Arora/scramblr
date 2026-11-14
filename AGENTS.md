# Product requirements

- Treat mobile and desktop as first-class experiences. Prioritize fast startup, immediate input feedback, readable text, and usable touch controls.
- Do not shrink content to unreadable sizes to preserve a desktop layout. Adapt layouts to narrow screens and the on-screen keyboard.
- Keep input focus stable during rapid training; changing a target must not dismiss the mobile keyboard.
- Keep the UI minimal and consistent. Use shared design tokens and components; the light-theme accent is #174d3b, matching the personal BB theme and FlickTab.
- Verify important flows on narrow and wide viewports, with keyboard and touch input. Include mobile keyboard behavior in verification.
- Keep README.md limited to `scramblr`. Keep product and development guidance here instead of adding prose documentation.
- Desktop scrambles stay on one line; mobile scrambles wrap at a readable size.
- The blind trainer quizzes solved-cube sticker positions using Speffz, with configurable orientation (default yellow U / blue F). Correct answers advance immediately; wrong answers reveal the letter briefly before advancing. No stats for now.
- Sidebar arrow keys switch pages immediately while navigation has focus. Escape returns focus without closing the desktop sidebar. Cmd/Ctrl+K is an unadvertised fuzzy page switcher.
- Use a fixed open-front cube outline with neutral walls. Shade the target face and show its grid and highlighted sticker; omit all other face grids. Do not show orientation color dots. On mobile, put practice selection behind a three-dot control, hide shortcut hints, and prioritize cube size. Do not detach or mirror faces or rotate between targets.
- After browser viewport testing, clear device emulation before handing the preview back. Verify the final preview uses the actual desktop window width; never leave a phone-width override on the user’s desktop tab.

- Blind contains Positions and Colors. Colors shows an isolated piece with all its colors visible and the target sticker outlined. Map colors to the home Speffz letter using the saved orientation; preserve corner handedness. Both trainers share rapid input, mode selection, feedback, and mobile layout.

- Desktop navigation starts open; mobile navigation starts closed. Time uses a 300 ms red-to-green hold, starts on release, and stops on the next Space press or touch. Keep the result visible while preparing the next scramble.
