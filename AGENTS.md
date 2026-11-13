# Product requirements

- Treat mobile and desktop as first-class experiences. Prioritize fast startup, immediate input feedback, readable text, and usable touch controls.
- Do not shrink content to unreadable sizes to preserve a desktop layout. Adapt layouts to narrow screens and the on-screen keyboard.
- Keep input focus stable during rapid training; changing a target must not dismiss the mobile keyboard.
- Keep the UI minimal and consistent. Use shared design tokens and components; the light-theme accent is #174d3b, matching the personal BB theme and FlickTab.
- Verify important flows on narrow and wide viewports, with keyboard and touch input. Include mobile keyboard behavior in verification.
- Keep README.md limited to `scramblr`. Keep product and development guidance here instead of adding prose documentation.
- Desktop scrambles stay on one line; mobile scrambles wrap at a readable size.
- The blind trainer quizzes solved-cube sticker positions using Speffz, with configurable orientation (default yellow U / blue F). Correct answers advance immediately; wrong answers reveal the letter briefly before advancing. No stats for now.
