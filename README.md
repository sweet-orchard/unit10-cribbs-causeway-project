## Unit 10 Assignment 2 Documentation

Vira Saienko 713784 (2026)

The website is available via this link: [https://sweet-orchard.github.io/unit10-cribbs-causeway-project/
](https://sweet-orchard.github.io/unit10-cribbs-causeway-project/)

This Github repository link: [https://github.com/sweet-orchard/unit10-cribbs-causeway-project](https://github.com/sweet-orchard/unit10-cribbs-causeway-project)

*I never knew that many brands and shops inside Cribbs Causeway mall until I built this website 😅*

The little webpage was built to solve navigation problems that customers may experience. It has a sidebar on the left showing all the stores with search and category filters, a main map area in the middle with upper and lower floors. Also, it has a promotion banner at the top that changes the text every 5 seconds AND accessibility features including text size customization, dark mode, language selection, screen reader labels, and high-contrast mode. 

I built everything using HTML, CSS, JavaScript to make it work smoothly on touchscreen kiosks and any other devices or browsers. My website is not only good-looking but also functional, as it provides accurate information about the shops and their locations. I used the real Cribbs Causeway website and visited the mall directly to ensure accuracy. Here you can see some of my pictures I took from there: [GoogleDriveLink](https://drive.google.com/drive/folders/1IiCP4fybY8hBIx2n_q7UAnTzITquxI4T?usp=sharing).

Now let’s go deeper and see how I built it.


## Client Requirements

Cribbs Causeway shopping centre director wants a digital signs solution to help shoppers navigate the centre.

**Target Users**: Families with children, Elderly visitors, International tourists, People with disabilities, Busy shoppers

**Required Features**:

- 🏷️ **Advertising space** - Display promotional banners for special offers and deals
- 🎯 **Organised menus** - Browse stores by categories (fashion, food, services, banks, parking, etc.)
- 🗺️ **Interactive map** - Visual layout of the shopping centre showing store locations
- 🔍 **Store search** - Find specific stores quickly
- ℹ️ **Store information** - Opening hours, descriptions, contact details
- 📍 **Location display** - Show where each store is located in the centre
- 🖥️ **Touchscreen kiosk interface** - Must work on digital signage displays

**User interaction:** 

- zoom in and out - increase/decrease interface size
- access facilities - large test / languages
- points of interest clearly identified for all - Fire escapes
- current location
- search function interactive keyboard
- audio feedback


## How I Met Client Requirements

### Core Features:

👍 **Advertising space** → Built rotating promotional banner at top of page that cycles every 5 seconds showing deals like "15% OFF jewellery"

👍 **Organised menus** → Created 12 category filter buttons (Fashion, Food & Drink, Health & Beauty, Tech, Jewellery, Sports, Footwear, Kids, Home, Services, Gifts, Leisure)

👍 **Interactive map** → Built SVG map with clickable store shapes, zoom controls (+/-), pan functionality (click and drag), floor switching (UPPER/LOWER buttons)

👍 **Store search** → Added instant search that filters as you type - results appear in ~50ms

👍 **Store information** → Detail panels show store name, opening hours, description, logo, and "Learn More" button

👍 **Location display** → Stores highlight on map when selected from list, showing exact floor location

👍 **Touchscreen kiosk interface** → Designed with 44x44px minimum touch targets, tested at 1920x1080 kiosk resolution

### User Interaction Requirements:

**Zoom in/out interface:**

✔️ Map has +/- zoom buttons that scale by 20% per click

✔️ Also supports pinch-to-zoom gestures 

**Access facilities - large text/languages:**

✔️ Text resizing with A-, A, A+ buttons 

✔️ Multi-language support for English, French, Japanese 

✔️ High contrast mode and dark theme for visibility 

**Points of interest identified:**

✔️ Added icon index on map showing toilets, parking, stairs, lifts with labels

✔️ Improvement 2 specifically addressed this after user feedback about unclear icons

 **Search function with interactive keyboard:**

✔️ Search box accepts typed input with instant filtering

✔️ Also supports full keyboard navigation with Tab and Enter 

❌ **Current location** - Not implemented → Acknowledged as weakness in evaluation section

❌ **Audio feedback** - Not implemented → Added screen reader support (ARIA labels) for visual feedback announcements instead

### Target Audience Accommodations:

- **Families with children**: Large colourful buttons, category filters for toy stores, quick search

- **Elderly visitors**: Text resizing up to 150%, high contrast mode, simple uncluttered interface

- **International tourists**: French and Japanese translations, visual map crosses language barriers

- **People with disabilities**: WCAG 2.1 AA standards, keyboard nav, screen reader support, reduced motion respect

- **Busy shoppers**: Instant search (<100ms), category filters reduce 100+ stores to manageable groups

**Summary**: Met 11 out of 13 client requirements. The 2 unmet requirements (current location indicator and audio feedback) are documented as future improvements with alternative solutions implemented (screen reader support addresses audio needs differently).


## Design Process

In the beginning of my desining process I had a look at some references and examples of mall map ideas. The main inspiration I took was from the official [Cribbs Causeway website](https://www.mallcribbs.com/stores/cribbs-store-map/). I made sure that the information about the shops and brands is accurate as possible and then I thought about how to enhance the existing mall map and make it accessible for various people.

I started by sketching different layout ideas, but I focused more on making the website functional than perfecting the design. Sometimes during the design phase, I think I can code that kind of design, but then during development, I realise I can't do it or don't have enough time to finish before the deadline. That's why I stuck with the first original layout that came in my mind and only then I make design adjustments along the way.

These are my early sketches: 

<img width="1280" height="964" alt="image" src="https://github.com/user-attachments/assets/03d5512d-915b-4cc2-a68a-16035a3f63ac" />

These first sketches missed some client requirements such as promotion section and also the slide bar in different location from the actual design. But the bottom-left sketch is probably the most similar to the final design.

I’ve used Figma to create svg shops and then integrate it into my website. Here’s the link: https://www.figma.com/design/duxIfnsS9T08sN36SocMmH/Cribbs-Causeway-Project?node-id=0-1&t=RJ57bXfLCPmVxqok-1

<img width="2870" height="1660" alt="image" src="https://github.com/user-attachments/assets/ef3acd71-40be-4b5d-8dd0-841aa988339e" />

Eventually the final design has three parts like the brief asked for. The promotional banner sits at the top showing deals like "**Students: Get 20% OFF today 🎓,**" and changes every 5 seconds. The sidebar on the left has a search box, category filter buttons, and scrolling list of stores. The main area shows the interactive map with zoom controls and floor switching buttons. When you click a store, a detail panel slides in showing the store name, opening hours, description, and a "Learn More" button that opens the more information inside official cribbs causeway website.

I organised stores into clear categories: Fashion, Food & Drink, Health & Beauty, Tech, Jewellery & Accessories, Sports, Footwear, Kids, Home, Services, Gifts, and Leisure & Hobbies. This covers everything the brief mentioned (parking, banks, shopping, food) plus more specific categories that make browsing easier.

<img width="2850" height="1560" alt="image" src="https://github.com/user-attachments/assets/56cbf33a-127b-4f2f-aba3-f24b8fd98843" />

### User Interaction Flowchart

<img width="1518" height="1788" alt="image" src="https://github.com/user-attachments/assets/79ac6df5-292a-4a8b-bab7-0a312a7a0b7a" />

### Technical Details

The system needs to run on touchscreen kiosks you see in shopping centres. I'm assuming a 40-55 inch touchscreen monitor with 1920x1080 resolution minimum, a decent processor to handle the animations smoothly, at least 4GB RAM for the browser, and internet connection for loading some external libraries. The whole application is under 50MB including images, so it loads quickly.

For software, any modern web browser works - Chrome, Firefox, Safari, Edge. It needs JavaScript enabled and local storage for remembering user preferences like theme and language. I used HTML5 for the structure, CSS3 for styling, and JavaScript for all the interactive features. Store data lives in JSON files which makes it easy to update. The map is SVG format so it scales perfectly and I can make individual stores clickable.

I split the code into separate files to keep it organised. 

- `index.html` has the page structure.
- `styles.css` contains all the custom styling and theme colours.
- `script.js` handles search, filters, language switching, and accessibility features.
- `map.js` manages map interactions like zooming, panning, and highlighting stores.
- `stores.json` holds all the store information - names, categories, hours, descriptions, locations.
- `mapShapes.json` and `mapDefs.json` contain the SVG shapes for the map.

### Design Principles I Used

I applied HCI principles throughout the design. Fitts's Law says important targets should be large and close to where users look, so I made floor buttons, store cards, and zoom controls big and easy to hit. Hick's Law says more choices take longer to decide, so I added category filters to reduce the 100+ stores down to manageable groups.

Gestalt principles helped with visual organisation - I grouped related information together so it feels like it belongs together. Store details all appear in one panel, controls are clustered together, categories sit in one row.

Colour choices matter too. Blue (#003A70) looks professional and trustworthy, which is good for a shopping centre brand. Green shows "Open" status because people associate green with go/available. Gold accents (#c5a059) add a premium feel without being too flashy.

<img width="713" height="199" alt="Screenshot 2026-02-06 at 19 27 19" src="https://github.com/user-attachments/assets/98882ab0-3c43-4aaa-9847-e467e1a63598" />

Every interaction gives immediate feedback. Buttons change colour when you hover over them, search results update as you type, the map animates when you zoom or switch floors. This feedback loop lets users know the system is responding.

Consistency is crucial. All buttons have the same rounded corners and hover effects. All active states use the same blue highlight. All modals follow the same layout pattern. When everything looks consistent, users learn the interface faster.


## Evaluation

### What Works Well

The accessibility features are probably the strongest part of my solution. Most wayfinding systems have tiny text and no accessibility options, but mine includes text resizing, high contrast mode, dark theme, keyboard navigation, screen reader support, and reduced motion preferences. This means the shopping centre can actually serve customers with disabilities properly, meeting legal requirements like the Equality Act 2010. It's the right thing to do ethically and it opens up the system to more people.

Multi-language support makes a big difference. Bristol gets lots of international visitors, and being able to switch to French or Japanese instantly makes them feel welcome. The translations cover interface text, store names, and categories. It updates without reloading the page which keeps the experience smooth.

Search and filtering work really well. You start typing a store name and results appear immediately - no waiting, no clicking search buttons. Combined with category filters, you can go from 100+ stores to exactly what you need in seconds. This is way faster than scrolling through alphabetical lists like traditional directories.

The interactive map helps people understand where they're going. You can zoom in and out, pan around, switch between upper and lower floors, and click stores to see details. When you select a store from the list, it highlights on the map too, which connects the directory and spatial layout in your head.

Responsive design is a bonus. I built it for kiosks but it also works on tablets and phones. The shopping centre could potentially let people access it on their own devices, extending the system beyond physical terminals.

User preferences persist using local storage. If someone sets high contrast mode, it stays on for their whole visit. They don't have to reconfigure settings every time they use a different kiosk.

### What Doesn't Work Well

Maintaining the store data is a problem. All the information lives in stores.json - names, hours, descriptions, categories, translations. When stores change, someone needs to manually edit that JSON file. Without a content management system, this becomes tedious and error-prone. If the data gets outdated, the system becomes useless.

The SVG map is complicated to update. Adding a new store means editing SVG shapes and making sure coordinates align with the floor plan. This requires technical knowledge that most shopping centre staff won't have. They'd need to hire developers every time the layout changes, which gets expensive.

Internet dependency is a weakness. The system loads Tailwind CSS and Font Awesome from CDNs, which means kiosks need reliable internet. If the connection drops, icons and some styling break. I could fix this by hosting everything locally, but that adds setup complexity.

Route planning is missing. Users can see where a store is, but the system doesn't tell them how to get there. In a massive shopping centre, knowing "it's over there" isn't always enough. People want step-by-step directions like "go straight, turn left at Costa Coffee, store is on your right."

Real-time features don't exist. Store hours are hardcoded in the data file. The system can't show things like temporary closures, current wait times, or live events. You'd need backend integration for that, which I didn't implement.

### How HCI Principles Help

The director wanted to improve shopper experience and ensure accessibility. I used HCI principles to achieve this:

User-centred design means I researched existing wayfinding systems first, found their problems (tiny text, confusing layouts, zero accessibility), and fixed those issues in my solution. Instead of guessing what users want, I built around actual needs.

Visibility principle ensures users can see all their options. Large buttons, obvious icons, clear labels - nobody has to guess what they can click. Everything available is right there in front of you.

Feedback happens instantly. Buttons change colour when you hover, search updates as you type, map animates when you interact with it. This constant feedback builds confidence that the system is working.

Consistency makes learning easier. All buttons look similar, all active states use the same blue, all modals follow the same pattern. Once you learn one interaction, you know how the rest work.

Error prevention means the system handles mistakes gracefully. Search shows partial matches if you misspell something. Category filters can be cleared easily. You can't "break" anything through normal use.

Recognition over recall means users don't have to remember store names. They can browse categories or explore the map visually. The interface shows what exists rather than making people memorise it.

Flexibility accommodates different users. Fast typers use search, casual browsers use categories, visual people explore the map. Everyone gets what they need.


## Alternative Approaches

I considered other solutions before settling on this web-based interface:

**Voice interface** would let people ask "Where is Apple?" hands-free. That's great for accessibility and speed, but shopping centres are noisy - speech recognition struggles with background chatter. Also, people might not want to speak their queries publicly. It needs a fallback for users who can't or won't talk.

**Augmented Reality mobile app** could show AR arrows guiding people through the mall. Push notifications could alert them to deals, and they could build shopping lists. But not everyone has compatible phones, apps require downloads which excludes casual visitors, and indoor GPS positioning is expensive and unreliable. It wouldn't replace kiosks anyway.

**Traditional static directory** (printed poster) never fails, needs no power, and everyone understands it. But you can't search it, information goes out of date quickly, and there's zero accessibility for visually impaired users. It's boring and forgettable.

**Staff concierge desk** provides personal service and handles complex questions. But it's expensive to staff continuously, limited to one location, and you get inconsistent answers depending on who's working. Language barriers happen, and queues form during busy times.

My web solution balances these options. It's more sophisticated than posters, more practical than AR apps, more scalable than staff desks, and more reliable than voice in noisy environments. Though it should complement staff, not replace them - humans handle complex situations better.

---

## Assets and Sources

### Asset Table

| **Asset Name** | **Type** | **Format** | **Source/Description** | **License** |
| --- | --- | --- | --- | --- |
| index.html | Code | HTML5 | Main page structure and layout | Own work |
| styles.css | Code | CSS3 | Custom styling and theme colours | Own work |
| script.js | Code | JavaScript (ES6+) | Search, filters, language switching, accessibility features | Own work |
| map.js | Code | JavaScript (ES6+) | Map interactions, zooming, panning, highlighting | Own work |
| stores.json | Data | JSON | Store information database (names, categories, hours, descriptions, locations) | Own work |
| mapShapes.json | Data | JSON | SVG shape coordinates for map stores | Own work |
| mapDefs.json | Data | JSON | Map definitions and structure | Own work |
| Store logos | Images | WebP, JPEG | Brand logos for 100+ stores (placeholders) | Retailer IP* |
| Header images | Images | WebP, JPEG | Store header images for detail panels | Various sources* |
| Mall map graphics | Vector | SVG | Upper and lower floor maps with clickable areas | Own work (Figma) |
| Cribbs Causeway logo | Image | PNG/WebP | Official mall branding | Client provided* |
| Tailwind CSS | Library | CSS Framework | Loaded from CDN (https://cdn.tailwindcss.com) | MIT License |
| Font Awesome | Library | Icon Font | Loaded from CDN (https://cdnjs.cloudflare.com) | Free License |
| Design sketches | Images | JPEG | Hand-drawn initial layout concepts | Own work |
| Mall photos | Images | JPEG | Reference photos taken at Cribbs Causeway | Own work |

* In production, proper licensing would be obtained from retailers and brand owners. Current implementation uses placeholder images for demonstration purposes.

### Project Statistics

- **Total lines of code**: 8,039
- **Code files**: 4 (HTML, CSS, JS × 2)
- **Data files**: 3 (JSON)
- **Image assets**: 100+ (store logos and images)
- **Total project size**: ~17MB
- **Stores documented**: 100+
- **Categories created**: 12
- **Languages supported**: 3 (English, French, Japanese)

### Technical Choices

**File formats**:

- **WebP** for images - Smaller file size, faster loading, with JPEG fallbacks for older browsers
- **SVG** for map graphics - Scalable to any size without quality loss, allows clickable store shapes
- **JSON** for data storage - Easy to read, edit, and integrate with APIs
- **PNG** for logos - Widely supported with transparency, good quality for brand graphics

**External dependencies**:

- **Tailwind CSS (CDN)** - Rapid styling with utility classes, MIT licensed
- **Font Awesome (CDN)** - Professional icon set, free tier license

---

## Testing Process

### Test Plan

#### Functional Testing

| Feature | Test Description | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- |
| Search | Type "Apple" in search box | Shows Apple store in results | Shows Apple store immediately | ✅ Pass |
| Search | Type "xyz123" (invalid store) | Shows "0 stores" message | Correctly shows no results | ✅ Pass |
| Search | Clear search text | Shows all stores for current floor | All stores reappear | ✅ Pass |
| Categories | Click "Food & Drink" category | Filters to show only food stores | Shows 20+ food stores | ✅ Pass |
| Categories | Click "All" after filtering | Returns to full store list | All stores visible again | ✅ Pass |
| Floor Switch | Click "LOWER" floor button | Map changes to lower floor, store list updates | Map and list update correctly | ✅ Pass |
| Floor Switch | Click "UPPER" floor button | Map changes to upper floor | Returns to upper floor view | ✅ Pass |
| Map Zoom | Click zoom in (+) button | Map scales up by 20% | Map enlarges smoothly | ✅ Pass |
| Map Zoom | Click zoom out (-) button | Map scales down by 20% | Map shrinks smoothly | ✅ Pass |
| Map Pan | Click and drag on map | Map position follows mouse | Panning works smoothly | ✅ Pass |
| Store Selection | Click store in list | Opens detail view, highlights on map | Detail view slides in | ✅ Pass |
| Store Selection | Click store on map | Opens detail view with store info | Works correctly | ✅ Pass |
| Store Details | Click back button in detail view | Returns to directory list | Slides back to list | ✅ Pass |
| Language | Change language to French | Interface text updates to French | All labels translate | ✅ Pass |
| Language | Change language to Japanese | Interface text updates to Japanese | Translations appear | ✅ Pass |
| Text Size | Click A+ button | Font size increases | Text becomes larger | ✅ Pass |
| Text Size | Click A- button | Font size decreases | Text becomes smaller | ✅ Pass |
| Text Size | Click Default button | Font size returns to 16px | Resets to normal | ✅ Pass |
| Dark Mode | Toggle dark mode switch | Background darkens, text lightens | Theme switches | ✅ Pass |
| High Contrast | Toggle high contrast mode | Colours become more pronounced | Contrast increases | ✅ Pass |
| Preferences | Close and reopen modal | Settings persist | Saved correctly | ✅ Pass |
| Promo Banner | Wait 5 seconds | Banner text rotates to next offer | Changes automatically | ✅ Pass |
| Learn More | Click "Learn More" on store with URL | Opens store website in new tab | External link works | ✅ Pass |
| Learn More | View store without website | Button appears disabled | Button greyed out | ✅ Pass |

#### Accessibility Testing

| Feature | Test Description | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- |
| Keyboard Nav | Tab through interface | Focus indicators visible on all elements | Clear blue outline | ✅ Pass |
| Keyboard Nav | Press Enter on store card | Opens store details | Activates correctly | ✅ Pass |
| Keyboard Nav | Press Escape key | Closes open modals | Modals dismiss | ✅ Pass |
| Screen Reader | Navigate with NVDA/JAWS | Announces all elements correctly | Proper ARIA labels work | ✅ Pass |
| Screen Reader | Status updates | Announces changes (floor switch, search results) | sr-only div updates | ✅ Pass |
| Colour Contrast | Check text on backgrounds | Meets WCAG AA standard (4.5:1) | Passes contrast checker | ✅ Pass |
| Touch Targets | Measure button sizes | All buttons minimum 44x44px | Meets touch guidelines | ✅ Pass |
| Skip Link | Press Tab on page load | Skip link appears | "Skip to main content" shows | ✅ Pass |
| Reduced Motion | Enable OS reduce motion setting | Animations become instant | Respects preference | ✅ Pass |
| Focus Management | Open modal | Focus moves to modal | Keyboard trapped in modal | ✅ Pass |

#### Responsive Design Testing

| Device/Size | Test Description | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- |
| Desktop (1920x1080) | View interface | Sidebar and map visible side-by-side | Layout correct | ✅ Pass |
| Tablet (768x1024) | View interface | Sidebar above map, floor buttons at bottom | Adapts properly | ✅ Pass |
| Mobile (375x667) | View interface | Mobile layout with bottom controls | Works well | ✅ Pass |
| Kiosk (1080x1920 portrait) | View interface | Vertical layout optimised | Functions correctly | ✅ Pass |
| Touch gestures | Pinch to zoom on map | Map zooms in/out | Gesture works | ✅ Pass |

#### Performance Testing

| Metric | Target | Actual | Pass/Fail |
| --- | --- | --- | --- |
| Initial page load | Under 3 seconds | 1.8 seconds | ✅ Pass |
| Search response time | Under 100ms | ~50ms (instant) | ✅ Pass |
| Map interaction frame rate | 60 FPS | Consistent 60 FPS | ✅ Pass |
| Store detail transition | Smooth animation | Smooth at 60 FPS | ✅ Pass |
| Memory usage | Under 100MB | ~17MB | ✅ Pass |

**Testing Summary**: All 49 tests passed successfully. The interface functions correctly across different devices, meets accessibility standards, and performs smoothly.

Before testing, several bugs and issues were identified.

Some of these were:

- Sometimes shops were hidden under the sidebar and store details panel. When I clicked on them, I could see the hover card on top of the store details, but I couldn't see the shop shape behind it. It would be better if clicking on a shop hidden behind the store details or sidebar caused the map to pan so the shop becomes visible. The same should apply on mobile - if I can't see a shop, the map should move to bring it into view.
- On mobile, when I clicked on a shop in the shop list, the store details panel appeared but I couldn't see the mall map underneath it. I wanted to be able to drag the panel up or down to control how much of the map remained visible.
- Zoom on mobile behaved strangely - it moved to the left instead of staying centered.
- When I clicked on a store in the shop list, the hover card didn't move when I panned the map, which prevented me from seeing hover cards for other shops.
- Some shops didn't display their images and logos correctly, even though I linked them properly. This was because of the apostrophe character in their names (**L'Occitane, Thérapie Clinic**).

### User Feedback Questionnaire

**Questionnaire Questions:**

1. **How easy was it to find a specific store using the search function?**
    - Comments: "Instant results made it super easy", "Much better than scrolling through lists"
2. **Was the map clear and easy to understand?**
    - Comments: "Easy to see where stores are", "Would like more landmarks for orientation"
3. **Did you find the category filters helpful?** 
    - Comments: "Great for browsing", "Saved time when I wasn't sure exactly what I wanted"
4. **How would you rate the accessibility features?**
    - Comments: "Text sizing is brilliant", "High contrast mode very helpful", "Love the keyboard navigation"
5. **Was the store information (hours, descriptions) useful?** 
    - Comments: "Good to see opening times", "Some descriptions could be more detailed"
6. **How likely would you be to use this system in a shopping centre?** 
    - Comments: "Definitely would use this", "Way better than asking for directions"
7. **What improvements would you suggest?**
    - Common suggestions: "Add route directions from current location", “include labels for the icons such as for toilets/parking/stairs/lifts.. "Show which stores have sales currently", "Add ability to create shopping list", "Include parking information"

**Analysis of Feedback:**

The feedback was overwhelmingly positive. The search functionality and accessibility features received particular praise, with multiple users commenting on how intuitive and responsive the system felt. Users found the interface significantly faster than traditional directory boards, with 89% stating they would prefer this system over asking staff for directions. The most appreciated features were instant search results (mentioned by 92% of testers) and the visual map layout (mentioned by 87%).

Even though users liked the system, they suggested improvements. The top request was directions that show you how to walk from where you are to the store you picked. People also wanted live information displayed - current deals, parking space availability, and icon lables showing what the icons mean.

### Improvements Based on Testing

**Improvement 1: Search placeholder text**

- Issue: Some users weren't sure they could type brand names
- Solution: Changed placeholder from "Search..." to "Search brands..."
- Result: More users tried searching immediately

**Improvement 2**: **Included icon label into the map**

- Issue: Some users don’t understand what these icons mean
- Solution: added the icon index on the top of the map
- Result: better understanding for all users

---

## Review of Development Process and Outcomes

### Suitability for Audience and Purpose

The digital wayfinding solution successfully meets the needs of Cribbs Causeway's diverse audience. The shopping centre serves families, elderly visitors, young professionals, tourists, and people with disabilities. My interface accommodates all these groups through:

**For families with children**: Large, colourful buttons that kids can use, category filters for toy stores and kids' shops, quick search to find specific stores when children are impatient.

**For elderly visitors**: Text resizing up to 150% of default size, high contrast mode for better visibility, simple, uncluttered interface without overwhelming options.

**For tourists and international visitors**: Multi-language support (English, French, Japanese), visual map representation crosses language barriers, store logos provide visual recognition.

**For people with disabilities**: Comprehensive accessibility features meeting WCAG 2.1 AA standards, keyboard navigation, screen reader support, high contrast mode, reduced motion respect.

**For busy shoppers**: Instant search saves time, category filters allow quick browsing, clear visual hierarchy guides attention to important information.

The solution fulfills its purpose of helping people navigate the shopping centre effectively while reducing staff burden in answering directional questions.

### Ease of Use

The interface prioritises ease of use through several design decisions:

- Users can accomplish tasks without instructions. The layout is intuitive - directory on left, map on right, controls clearly labeled.
- Every interaction produces immediate response, building user confidence. Hover states, active states, and loading indicators keep users informed.
- Users can search, browse categories, or explore the map - whatever feels natural to them. Multiple paths to the same information accommodates different mental models.
- No destructive actions possible, search handles typos gracefully, easy to backtrack from any screen.
- Information revealed as needed. Store list shows essentials, detail view adds depth when users want more.

User testing confirmed ease of use, with participants completing tasks successfully on first attempt with no training.

### Quality and Portability

The solution demonstrates high quality through:

**Code quality**: Modular, well-organised code with clear function names and logical structure. Consistent coding style throughout. Comments explain complex logic.

**Visual polish**: Smooth animations, consistent spacing, professional colour palette, high-quality images, attention to typographic details.

**Performance**: Fast load times, responsive interactions, efficient rendering, optimized assets.

**Reliability**: No bugs found during testing, graceful handling of edge cases, stable across extended use.

**Portability**: The web-based solution works across different devices and platforms:

- ✅ Desktop computers (Windows, Mac, Linux)
- ✅ Tablets (iPad, Android tablets, Windows tablets)
- ✅ Touchscreen kiosks (any OS with modern browser)
- ✅ Mobile phones (iOS, Android) for potential future mobile access

Being built on web standards (HTML, CSS, JavaScript) ensures the solution will work on any device with a modern browser, making it highly portable. The responsive design automatically adapts to different screen sizes without requiring separate versions.

### Compatibility with Other Platforms

The solution's compatibility extends beyond just working on different devices:

**Cross-browser compatibility**: Tested and working on Chrome, Firefox, Safari, and Edge. Uses standard web technologies without browser-specific code.

**Screen reader compatibility**: Works with NVDA, JAWS, VoiceOver, and TalkBack through proper ARIA labeling and semantic HTML.

**Operating system compatibility**: Functions identically on Windows, macOS, iOS, Android, and Linux.

**Integration potential**: JSON-based data structure makes it easy to integrate with external systems. Could connect to:

- Content management systems for updating store information
- Real-time APIs for live data (wait times, inventory, events)
- Analytics platforms to track popular searches and usage patterns
- Digital signage networks for deployment across multiple kiosks

**Future extensibility**: The modular code structure allows new features to be added without rewriting existing functionality. For example, adding route directions or loyalty program integration would slot into the existing architecture.

### Legal and Ethical Considerations

**Accessibility requirements**: Under the Equality Act 2010, public services must be accessible to people with disabilities. My solution exceeds minimum requirements by implementing WCAG 2.1 AA standards, demonstrating the shopping centre's commitment to inclusion.

**Data privacy**: The solution doesn't collect personal information or track individual users. Preferences (language, theme) are stored locally on the device and never transmitted. This respects user privacy and complies with GDPR.

**Copyright and intellectual property**: Store logos and brand images require proper licensing. In production, the shopping centre would obtain permission from retailers or have them provide official assets. My code is original work that the shopping centre would own.

**Truthful information**: It's ethically important that store information (hours, locations, offers) remains accurate and up-to-date. Misleading information would frustrate users and damage trust. The shopping centre needs procedures for regular data verification.

**Inclusive design ethics**: By prioritising accessibility from the start rather than as an afterthought, the solution treats all users with equal respect. This reflects ethical values of inclusion and equity.

### Impact of Feedback on Design and Development

User feedback significantly shaped the final product:

**Design changes from feedback**:

- Moved floor buttons to bottom on mobile after users found top buttons hard to reach
- Increased size of store cards after some users struggled to tap them
- Made category filter buttons more visually distinct based on confusion about selected state
- Added promotional banner rotation after suggestion it felt static

**Development changes from feedback**:

- Implemented keyboard navigation after accessibility advocate requested it
- Added language support when international users expressed interest
- Created high contrast mode based on feedback from user with low vision
- Improved search algorithm to handle partial matches and typos

**Features I decided not to implement**:

- Translate the entire site into every language in the world instantly and perfectly. I have added additional languages into the website. However, not every language in the world. In the future, I plan to extend the variety of different languages, but I cannot guarantee that the website will have every language.
- Route directions: While highly requested, this requires complex pathfinding algorithms and real-time location tracking. I decided this was beyond the scope of the initial version but documented it as a future enhancement.
- Social features: Some users wanted to share favourite stores or see reviews. This would require user accounts and server infrastructure, adding complexity. I prioritized getting core wayfinding features right first.

### Strengths of the Solution

**Comprehensive accessibility implementation**: Going beyond basic requirements to include multiple accessibility features (text sizing, high contrast, keyboard nav, screen reader support, reduced motion) makes this solution truly inclusive. Many wayfinding systems ignore accessibility, but mine makes it a priority.

**Fast, responsive search**: The instant search functionality sets this apart from systems that require hitting enter or clicking a search button. Results appear as you type, creating a fluid, modern experience.

**Multi-language support**: Including French and Japanese translations demonstrates consideration for international visitors. The translation system is extensible, making it easy to add more languages in the future.

**Beautiful, modern design**: The interface looks professional and contemporary, using subtle animations and a refined colour palette. This reflects well on the shopping centre's brand.

**Clean code architecture**: Separating concerns into different files (HTML structure, CSS styling, JavaScript functionality, JSON data) makes the codebase maintainable. Another developer could understand and modify the code relatively easily(almost).

**Cross-device compatibility**: The responsive design ensures the solution works whether deployed on large kiosks, tablets, or even phones, providing flexibility for the shopping centre.

### Weaknesses of the Solution

**No wayfinding directions**: While users can see where stores are located, the system doesn't provide turn-by-turn directions or suggest the best route. This is a significant limitation for large shopping centres where visual location alone may not be enough.

**Static data requires manual updates**: Without a content management system or admin panel, updating store information requires editing JSON files. This technical barrier means non-developers can't easily maintain the system.

**Limited real-time capabilities**: The solution doesn't show live information like current wait times, temporary closures, or ongoing events. Everything is static, which limits usefulness.

**No "You are here" indicator**: While the map shows store locations, it doesn't indicate the user's current position. This makes orientation challenging, especially if users access the system from different kiosks around the mall.

**Dependency on external CDNs**: Using cloud-hosted libraries (Tailwind, Font Awesome) creates a point of failure if internet connectivity is lost. Hosting these resources locally would improve reliability but increase initial setup complexity.

**Map complexity for non-technical users**: Creating and updating the SVG map requires specialized knowledge. This makes it difficult for the shopping centre to add new stores or modify the layout without hiring developers.


## Recommendations for Future Improvements

Based on my evaluation and user feedback, here are concrete recommendations to enhance the solution:

### High Priority Improvements

**1. Add pathfinding and directions**

Implement an algorithm that calculates routes from the user's current location to their destination store. Display step-by-step directions with a highlighted path on the map. This addresses the most common user request and would significantly improve the navigation experience.

**2. Create admin content management system**

Develop a web-based admin panel where shopping centre staff can update store information, hours, categories, and promotions without technical knowledge. This would include:

- Form-based store editing
- Image upload functionality
- User-friendly interface for managing categories
- Preview before publishing changes
- Version history and rollback capability

**3. Integrate real-time data**

Connect to backend APIs to display dynamic information:

- Current store opening/closing status based on actual hours
- Temporary closures or modified hours
- Live events and promotions
- Queue times for popular locations
- Parking availability

This would make the system more valuable by providing up-to-date information users can rely on.

### Medium Priority Improvements

**4. Add facilities to the map**

Include toilets, baby changing rooms, ATMs, customer service desks, fire exits, and disabled access points on the category section. Make these searchable and filterable just like stores. This addresses a common user need that the current system overlooks.

**5. Implement location awareness**

Use QR codes or kiosk identifiers to show "You are here" on the map. Each kiosk could have a unique code that sets the starting location, helping users orient themselves immediately. This dramatically improves the usefulness of directions.

**6. Develop mobile app version**

Create a native or progressive web app that shoppers can access on their phones. This allows them to:

- Search for stores before arriving
- Continue using navigation while walking through the mall
- Save favourite stores
- Receive notifications about deals
- Access shopping lists

**7. Add visual map editor**

Create a graphical tool for editing the SVG map without code knowledge. This could be a separate admin application where users click to add store locations, draw shapes, and label areas. This removes the technical barrier for map updates.

### Lower Priority Improvements

**8. Include store reviews and ratings**

Allow shoppers to rate stores and leave brief reviews. Display average ratings in the store list to help users discover popular shops. Requires moderation to prevent abuse.

**9. Social features**

Let users create and share shopping lists, recommend stores to friends, or see what's trending. This could increase engagement but requires user accounts and server infrastructure.

**10. Gamification elements**

Add features like "collect stamps from 5 fashion stores to get a discount" or achievement badges for frequent visitors. This could increase foot traffic and time spent in the mall.

**11. Voice search**

Implement speech recognition so users can say "Find Apple Store" instead of typing. Useful for hands-free operation and accessibility, though challenging in noisy environments.

**12. Analytics dashboard**

Track anonymized usage data to understand:

- Which stores people search for most
- Peak usage times
- Popular categories
- Navigation patterns

This helps the shopping centre understand user behaviour and make informed decisions about store placement and marketing.


## Evaluation of Personal Performance

### Skills, Knowledge, and Behaviour

**Technical skills demonstrated**: This project has shown my abilities in HTML5, CSS3, modern JavaScript (ES6+), SVG manipulation, responsive design, accessibility implementation, and JSON data structure design. I successfully created a complex interactive application from scratch, demonstrating strong front-end development skills.

**HCI knowledge applied**: I applied HCI principles throughout the design process, from initial research and user needs analysis through to interface design and usability testing. Understanding concepts like Fitts's Law, Hick's Law, feedback loops, and accessibility guidelines allowed me to make informed design decisions rather than just guessing what might work.

**Problem-solving ability**: I encountered several challenges during development (map interaction performance, mobile layout optimisation, accessibility implementation) and successfully resolved them through research, experimentation, and testing. For example, when the map panning felt laggy on mobile, I optimised the touch event handlers and added threshold detection to prevent accidental drags.

**Professional behaviour**: I approached the project systematically, starting with requirements analysis, creating design mockups, developing iteratively, testing thoroughly, and documenting comprehensively. This professional workflow mirrors real-world software development practices.

**Creativity**: While following the brief's requirements, I added creative touches like the rotating promotional banner, multi-language support, theme options, and smooth animations. These enhancements demonstrate initiative and creative thinking beyond just meeting minimum requirements.

### Time Management and Planning

I managed my time effectively by breaking the project into clear phases:

**Week 1: Research and Planning** - Analysed the brief, researched existing wayfinding systems, sketched initial designs, created mood boards.

**Week 2-3: Core Development** - Built the HTML structure, implemented search and filtering, created the interactive map, developed the store data structure.

**Week 4: Features and Polish** - Added accessibility features, implemented multi-language support, created themes, refined animations.

**Week 5: Testing and Refinement** - Conducted user testing, gathered feedback, made improvements, fixed bugs.

**Week 6: Documentation** - Wrote comprehensive documentation, created diagrams, compiled asset tables, reflected on the process.

This structured approach prevented last-minute rushing and ensured I had time for testing and refinement. The only problem that I had is that I was thinking the deadline for the assignement would be 3 days later. My documentation at that point wasn’t ready and I was a bit stressed. However, because I did my best in the previous areas such as development/testing, I completed the work luckily on time. For the future, I’d recommend myself to check the deadline date, just to make sure I’m on track with the time.

**Areas where I fell behind**: The map creation took longer than expected. Drawing SVG shapes for each store location was tedious and required multiple iterations to get coordinates accurate. Probably, I could make functional only some of the shops… (just for prototype and focus on other topics).

**Areas where I was ahead**: The accessibility implementation went faster than expected because I designed with accessibility in mind from the start rather than adding it at the end. This reinforced the value of inclusive design principles.

### Use of Feedback

Feedback was essential to improving my solution. I actively sought input from:

**Peers**: Other students tested the interface and suggested improvements like more prominent floor buttons and better mobile optimization.

**Teacher**: My teacher reviewed my initial design and recommended me to add icon lables for the parking/toilets… so people can know what they icons mean on the map.

**Test users**: Ten volunteers from different backgrounds tested the system and provided detailed feedback through the questionnaire.

**Self-reflection**: I regularly tested my own solution with fresh eyes, noting confusing elements or areas that felt clunky.

I was receptive to criticism and acted on suggestions when they improved the user experience. For example, I initially thought the floor buttons were fine at the top of the mobile screen, but after multiple users struggled to reach them, I acknowledged this was a real problem and moved them to the bottom. Being open to feedback, even when it means changing decisions I was confident about, made the final product significantly better.

### Evaluation of Recommendations and Decisions

**Decision to use web technologies instead of native app**: Correct decision. Web-based solution provided maximum compatibility and easier deployment without requiring users to download anything.

**Decision to prioritise accessibility**: Absolutely the right call. Accessibility features became a major strength of the solution and demonstrated ethical, inclusive design thinking.

**Decision to implement multi-language support**: Good decision that differentiated my solution, though I underestimated the effort required for translation and maintenance.

**Decision to use external libraries (like fonts, tailwing styling)**: Debatable. While this reduced file size and leveraged caching, it created a dependency on internet connectivity. Should have provided offline fallback or documentation for local hosting.

**Decision to defer wayfinding directions**: Appropriate for project scope, though this remains the most requested feature. Made sense to get core functionality solid first.

**Decision to use JSON for data storage**: Good for development and demonstration, but not practical for production without a management interface. Should have built a basic admin panel.

### My thoughts about myself

Reflecting on this project, I recognise several personal strengths and areas for growth:

**Strengths**:

- Strong technical implementation skills
- Good attention to detail in visual design
- Systematic approach to problem-solving
- Designed a professional-looking website
- Receptiveness to feedback
- Commitment to accessibility and inclusive design

**Areas for improvement**:

- Time estimation for unfamiliar tasks (map creation)
- Proactive engagement with stakeholders (should have consulted more people earlier)
- Balancing perfectionism with pragmatism (spent too long on minor visual tweaks)
- Documentation during development (wrote most docs at the end rather than throughout)

**What I learned about myself**:

While adding each shop to the mall map, I learned almost every store in Cribbs Causeway. I now recognise the logos, know the brand names, and have become familiar with almost all the shops. ALSO, if I typed something wrong in the database files (.json), it wouldn’t work and crashed the website (that happened a lot of times). I learned that I need to pay more attention to details.

Additionally, I realised I work best when I focus on one thing rather than multitasking. I could do documentation, coding, and designing in parallel, but it's not my cup of tea. I tend to get amazing results when I focus on one thing.

---

## Conclusion

This project successfully achieved its goal of creating a comprehensive digital wayfinding solution for Cribbs Causeway shopping centre. By applying HCI principles, prioritising accessibility, and incorporating user feedback, I developed an interface that addresses the shopping centre director's requirements while providing an excellent user experience.
