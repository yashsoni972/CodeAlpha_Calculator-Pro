# Calculator Pro

A professional, feature-rich calculator built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## Live Demo

🔗 **[https://YOUR_USERNAME.github.io/CodeAlpha_Calculator-Pro](https://YOUR_USERNAME.github.io/CodeAlpha_Calculator-Pro)**

> Replace `YOUR_USERNAME` with your GitHub username after deploying.

Or open `index.html` locally in any modern browser — no setup, no install needed.

---

## Features

### Standard Calculator
- All arithmetic operations — Addition `+`, Subtraction `−`, Multiplication `×`, Division `÷`
- Percentage `%` — converts current value to its decimal equivalent (e.g. `50` → `0.5`)
- Toggle sign `+/−` — switches between positive and negative
- Decimal point support with duplicate-dot prevention
- Delete last digit `⌫` and clear all `AC`
- Real-time expression display above the result

### Scientific Calculator
Click the **Scientific** button in the top bar to reveal 12 extra functions:

| Button | Function |
|--------|----------|
| `sin` | Sine (degrees) |
| `cos` | Cosine (degrees) |
| `tan` | Tangent (degrees) |
| `log` | Base-10 logarithm |
| `ln` | Natural logarithm |
| `√` | Square root |
| `x²` | Square (x × x) |
| `xʸ` | Power (x to the y) |
| `π` | Inserts π (3.14159…) |
| `e` | Inserts Euler's number (2.71828…) |
| `(` `)` | Parentheses for grouping expressions |

### Operation Indicator
While performing a calculation, a live label appears in the top-left of the display showing the active operation — `ADD`, `SUBTRACT`, `MULTIPLY`, `DIVIDE`. The active operator button also glows to confirm selection.

### History Panel
- Click the **clock icon** (top-right) to open the history panel
- Stores the last **50 calculations** with expression and result
- Click any history item to load that result back into the calculator
- History is saved in **localStorage** — persists after page refresh
- **Clear** button wipes all history

### Dark / Light Mode
- Click the **moon/sun icon** (top-right) to toggle between dark and light themes
- Smooth animated transition across all colors
- Theme preference can be extended to localStorage (manual addition)

### Sound Feedback
Professional, subtle calculator-style click sounds using the Web Audio API:

| Action | Sound |
|--------|-------|
| Digit press | Short high tick |
| Operator press | Slightly lower tick |
| Equals `=` | Two-tone soft confirm |
| Clear `AC` | Low soft thud |
| Delete `⌫` | Mid soft click |
| Scientific button | Clean tick |
| Error | Low warning tone |

### Ripple Effect
Every button press produces a material-style ripple animation at the exact point of click.

### Keyboard Support

| Key | Action |
|-----|--------|
| `0` – `9` | Input digit |
| `+` `-` `*` `/` | Operators |
| `%` | Percent |
| `.` | Decimal point |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last digit |
| `Escape` | Clear all |

---

## Color System

Each button group has its own distinct color for instant visual recognition:

| Group | Color |
|-------|-------|
| Numbers | Indigo / dark blue |
| Operators `÷ × − +` | Purple (glows when active) |
| Clear `AC` | Red |
| Delete `⌫` | Amber / yellow |
| Percent `%` | Sky blue |
| Toggle sign `+/−` | Emerald green |
| Decimal `.` | Pink |
| Equals `=` | Indigo → violet → pink gradient |
| Scientific | Cyan |

---

## File Structure

```
task 2/
├── index.html   — markup, layout, all buttons
├── style.css    — themes (dark/light), colors, animations
├── script.js    — all logic, audio, history, scientific functions
└── README.md    — this file
```

---

## Browser Support

Works in all modern browsers that support the Web Audio API:
Chrome, Edge, Firefox, Safari (14+), Opera.

---

## How to Run

1. Download or clone the project folder
2. Open `index.html` in any browser
3. No server, no build step, no dependencies
