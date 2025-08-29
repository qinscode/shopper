Shopper — Design Specification (Figma handoff)

Scope
This document faithfully describes the UI and features visible in the provided Figma flow. It does not add or remove functionality beyond what’s shown.

⸻

1) App summary

A lightweight mobile app for creating shopping lists, adding items, and marking them complete. Items can optionally store a URL and an image. The app uses a dark theme with a teal/green primary color. The core user journey:

Splash → Onboarding (3 screens) → Empty state for Lists → Create a List (name)
→ List detail (empty) → Add items (type or choose suggestions)
→ Item detail utilities: Add URL / Add Image
→ List detail (non-empty and complete states)
→ Lists Overview (multiple lists, with Duplicate / Hide and Search icon)


⸻

2) Visual language

Values are taken directly from the mockups (approximate where exact tokens aren’t labeled).

	•	Theme: Dark.
	•	Primary color: Teal-green (used for CTAs, active dots, checkmarks, progress ring accent).
	•	Surface: Near-black background.
	•	Text: High-contrast light text on dark surfaces. Secondary text uses muted gray.
	•	Radii: Buttons and list cells use rounded corners (pill buttons; list cells ~large radius).
	•	Iconography: Outline icons for back, link, image/attachment, duplicate, hide, search.
	•	Illustrations: Used on onboarding and empty states.

Typography (by usage in mocks)
	•	Large Title (e.g., “Shopper”, screen titles)
	•	Body text (descriptive copy / helper text)
	•	Button label (all caps/sentence case as shown)
	•	Small caption (e.g., hints like “swipe left on any item to delete it”)

Common component sizes (as seen)
	•	Buttons: full-width, ~48–56px height, pill shape.
	•	Icon buttons: circular/rounded, standard mobile touch target (~44px).
	•	Text fields: full-width rounded inputs.
	•	List rows: tall, with comfortable vertical padding.

⸻

3) Navigation model
	•	Back navigation: Left-chevron in the header on inner screens (e.g., list detail, add URL/image).
	•	Forward navigation: Primary CTAs (e.g., “Start using Shopper”, “Create”, “Continue”, “Add Item”, “Save”).
	•	Progress indicator: In list detail, a circular count chip at the top-right shows completed/total (e.g., 1/3, 4/4).

⸻

4) Screens & behaviors

4.1 Splash
	•	Layout: Dark full screen with centered app name “Shopper”.
	•	Behavior: Entry point. Transitions into onboarding.

⸻

4.2 Onboarding (three screens)

Common elements (all 3 screens):
	•	Header title: “Shopper” (first two screens) / third screen uses a feature-specific title (see below).
	•	Feature illustration centered.
	•	Headline + short supporting body.
	•	Carousel dots near bottom center (first/second/third active dot respectively).
	•	Primary CTA: “Start using Shopper”.

Screen 1
	•	Headline: “Shopping Lists”
	•	Body: ...made easy and convenient

Screen 2
	•	Headline: “Never forget anything on your list”
	•	Body: ...no need to memorize

Screen 3
	•	Headline: “Use shopper for your online shopping too!”
	•	Body: ...make a list now, buy it later

CTA outcome (all three): Proceeds into the app (flow continues to Lists → Empty state in the mock).

⸻

4.3 Lists — Empty state
	•	Title: “Your shopping Lists” (top center).
	•	Illustration: Large cart graphic in the center.
	•	Helper copy:
You have not added any shopping lists
Tap the button below to create one now
	•	Primary action: “+ Create” (full-width pill).
	•	Action result: Opens the New List (naming) screen.

⸻

4.4 New List (naming)
	•	Title area: “Name your list”.
	•	Text field: Rounded single line. Example content shown: “Weekly Household Shopping”.
	•	Buttons:
	•	Cancel (secondary, gray) → returns to Lists (Empty state).
	•	Continue (primary, green/teal) → creates the list and opens List Detail (empty).

⸻

4.5 List Detail — Empty
	•	Header title: The list name (example: “Saturday weekly shopping”).
	•	Top-right chip: Circular progress 0/0.
	•	Illustration: Large “EMPTY” style graphic.
	•	Helper copy:
Your list is empty,
Click the button below to add an item now
	•	Primary action: “+ Add Item” → opens Add Items screen.

⸻

4.6 Add Items (search & suggestions)
	•	Search / input field: Prominent rounded field at top (example typed value: “Bread”).
	•	Suggestion list: Vertical list of common items. Each row has:
	•	Item name (e.g., toilet paper, Peanut butter, Aluminium foil, Paper Bags for recycling).
	•	Trailing action: “ADD” (tappable).
	•	Behavior:
	•	Tapping ADD appends the item to the current list.
	•	Back navigation returns to List Detail with updated counts.

The mock shows a typed example (“Bread”) plus suggested items with ADD affordances.

⸻

4.7 List Detail — Non-empty (in-progress)
	•	Header title: Current list name (e.g., “Saturday weekly shopping”).
	•	Top-right chip: Circular progress (e.g., 1/3).
	•	Section: “Share this list” label appears above items (entry to sharing is present visually; the share flow itself is not depicted in the mock).
	•	Item rows: Each item is a rounded card with:
	•	Left-side small icons indicating attachments:
	•	Link icon appears when a URL is attached.
	•	Image icon appears when an image is attached.
	•	Item name (e.g., Bread, Cheese, A Dress).
	•	Trailing status control:
	•	Unchecked: hollow circle.
	•	Checked: green checkmark in circle.
	•	Primary action: “+ Add Item” (bottom) → returns to Add Items screen.
	•	Hint text (appears on complete examples as well):
swipe left on any item to delete it

Per-item utilities (from this screen):
	•	Add URL for an item
	•	Entry: From an item’s actions (wires in the mock lead from the item row).
	•	Screen title: “Add Url for [Item Name]” (example: Bread).
	•	Text field: URL input (example: http://amazon.bread).
	•	Buttons: Cancel / Save.
	•	Save returns to List Detail; the item shows the link icon.
	•	Add Image for an item
	•	Entry: From an item’s actions.
	•	Step 1 screen: “Add Image for [Item Name]” with an image placeholder/camera tile.
	•	Step 2 screen (preview): Full preview of the chosen image with Cancel / Save.
	•	Save returns to List Detail; the item shows the image icon.

⸻

4.8 List Detail — All checked (complete state examples)
	•	Two examples shown:
	•	“Weekly Groceries” with 4/4
	•	“Back to School List” with 5/5
	•	Rows: All items display the checked state (green checkmark).
	•	Share section: “Share this list” appears above items.
	•	Primary action: “+ Add Item” remains available.

⸻

4.9 Lists Overview (multiple lists)
	•	Header: “Your shopping Lists”
	•	Top-right: Search icon (behavior not depicted further in the mock).
	•	List cards: Each row shows:
	•	List name (e.g., Weekly Groceries, Christmas Groceries, Back to School).
	•	Preview items (small gray line such as rice, bread, plantain + 13 more).
	•	Right-side circular progress with completed/total (e.g., 4/4, 0/15, 5/5), ring styled in green when complete.
	•	Right-side actions stack: Duplicate and Hide (icons with labels as shown).
	•	Primary action: “+ Create” (bottom-right) → opens New List (naming).

⸻

5) Features (exactly as shown)
	•	Create and name shopping lists.
	•	View lists in an overview with:
	•	Progress chips per list (completed/total).
	•	List preview text (first few items + “+ X more”).
	•	Actions visible on each card: Duplicate, Hide.
	•	Search icon in the header (presence shown; further flow not depicted).
	•	Open a list to see:
	•	Title + a progress chip (e.g., 1/3).
	•	Share this list section label (entry visible; the share flow is not shown).
	•	Item rows with:
	•	Mark complete/incomplete.
	•	Optional URL (link icon) and Image (image icon) per item.
	•	Swipe left to delete (hint text explicitly shown).
	•	Add items:
	•	From Add Item screen using a typed field and/or suggested items with “ADD”.
	•	Add an URL to an item (dedicated screen with Cancel/Save).
	•	Add an Image to an item (picker/placeholder then preview → Cancel/Save).
	•	Empty states for both Lists (no lists yet) and List detail (no items yet).
	•	Onboarding (3 informative screens) with Start using Shopper CTA.
	•	Splash screen.

No login/account screens, quantities, reordering, reminders, collaboration settings, or other flows are depicted in this mock. They are therefore out of scope in this spec.

⸻

6) Components (as used)

Buttons
	•	Primary (filled, teal/green): “Start using Shopper”, “+ Create”, “Continue”, “+ Add Item”, “Save”.
	•	Secondary (filled gray/outlined gray where shown): “Cancel”.

Inputs
	•	Text field (single line): For list name and URL entry.
	•	Search/add field: Large rounded input at the top of Add Items.

List Row (item)
	•	Container: Rounded, dark surface.
	•	Leading slot: small attachment icons (link, image) appear after those are added.
	•	Label: Item name.
	•	Trailing control: circular toggle
	•	Unchecked (hollow)
	•	Checked (green checkmark)

Progress Chip
	•	Circular ring with centered text X/Y.

Headers
	•	Title centered.
	•	Left back chevron on inner screens.
	•	Right content varies (e.g., progress chip in list detail; search icon on Lists Overview).

Carousel Dots (Onboarding)
	•	3 dots; the active dot is teal/green, others are gray.

⸻

7) Copy (as displayed)
	•	Splash: Shopper
	•	Onboarding 1:
Title: Shopper
Headline: Shopping Lists
Body: ...made easy and convenient
CTA: Start using Shopper
	•	Onboarding 2:
Title: Shopper
Headline: Never forget anything on your list
Body: ...no need to memorize
CTA: Start using Shopper
	•	Onboarding 3:
Title: Shopper
Headline: Use shopper for your online shopping too!
Body: ...make a list now, buy it later
CTA: Start using Shopper
	•	Lists (empty):
Title: Your shopping Lists
Body: You have not added any shopping lists / Tap the button below to create one now
CTA: + Create
	•	New list:
Title: Name your list
Example field value: Weekly Household Shopping
Buttons: Cancel, Continue
	•	List detail (empty):
Title: (list name) e.g., Saturday weekly shopping
Helper: Your list is empty, / Click the button below to add an item now
CTA: + Add Item
	•	Add items:
Field example: Bread
Suggestion rows: toilet paper, Peanut butter, Aluminium foil, Paper Bags for recycling
Row action: ADD
	•	List detail (non-empty):
Section label: Share this list
Hint: swipe left on any item to delete it (on complete screen examples)
	•	Add URL:
Title: Add Url for [Item Name]
Field example: http://amazon.bread
Buttons: Cancel, Save
	•	Add Image:
Title: Add Image for [Item Name]
Buttons: Cancel, Save
	•	Lists Overview:
Title: Your shopping Lists
Card actions (labels shown near icons): Duplicate, Hide
Card previews like: rice, bread, plantain + 13 more

⸻

8) States & transitions
	•	“Start using Shopper” (from any onboarding screen) → Lists (empty) in this flow.
	•	“+ Create” (Lists empty) → Name your list.
	•	“Continue” (Name your list) → List detail (empty) with the new list title.
	•	“+ Add Item” (List detail) → Add Items.
	•	“ADD” (suggestion row) → Adds to current list; back returns to list with updated X/Y.
	•	Item row → Add URL → Save → Item shows link icon.
	•	Item row → Add Image → Pick → Preview → Save → Item shows image icon.
	•	Mark complete on an item → X/Y increments and the row shows a green check.
	•	Swipe left on an item → Delete (per the on-screen hint; the deletion confirmation flow is not depicted).
	•	Lists Overview shows multiple lists with each card’s progress ring; right-side Duplicate / Hide actions are present (the subsequent screens for these actions are not depicted).

⸻

9) Data model (implied by UI)
	•	List
	•	name
	•	items[]
	•	completedCount / totalCount (for progress chip and list cards)
	•	Item
	•	name
	•	isCompleted
	•	url (optional)
	•	image (optional)

(Only fields directly implied by the UI are listed.)

⸻

10) Accessibility & usability notes (reflecting current UI)
	•	Button sizes and list rows meet typical mobile touch targets.
	•	Checked vs. unchecked states are indicated by icon shape/color (as shown).
	•	Empty-state copy and illustrations clearly indicate next steps.

⸻

Out of scope (not shown in Figma)

Authentication, collaboration roles, quantities/units, reordering/sorting, reminders/notifications, barcode scanning, share target selection, archived lists view, search flow details, and any settings/preferences. If needed, these would be documented separately.

⸻

End of spec.