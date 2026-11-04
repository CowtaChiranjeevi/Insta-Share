# Insta Share

A responsive Instagram-style web app built with **React** by [Cowta Chiranjeevi](https://github.com/CowtaChiranjeevi). Users log in, browse a stories bar and a feed of posts, like and comment on posts, share them to social platforms, search posts by caption (with live suggestions), and open their own profile or any other user's profile.

The UI follows the [Figma design](https://www.figma.com/file/FwBVnpWfl5DYJ77kbljTdT/Insta_Share?node-id=0%3A1) and works on mobile, tablet and desktop using CSS media queries.

> Click any section below to expand it.

---

<details>
<summary><b>Tech stack</b></summary>

<br>

| Area | Technology |
| --- | --- |
| UI library | React (functional components and hooks: `useState`, `useEffect`, `useCallback`, `useParams`, `useNavigate`, `useLocation`) |
| Build tool | Vite |
| Routing | `react-router-dom` |
| Auth storage | `js-cookie` (JWT kept in a cookie named `jwt_token`) |
| Icons | `react-icons` |
| Stories slider | `react-slick` with `slick-carousel` |
| Loader | `react-loader-spinner` |
| Styling | Plain CSS, one CSS file per component, media queries for responsiveness |
| Data | REST APIs at `https://apis.ccbp.in` |

</details>

<details>
<summary><b>Features at a glance</b></summary>

<br>

**Core features**

- Login with username and password, with the server's error message shown on failure
- Protected routes: pages open only when you are logged in
- Stories bar (slider) at the top of the home page
- Feed of posts with author, image, caption, likes, comments and time
- Like and unlike a post with a live likes counter
- Search posts by caption
- Your own profile (**My Profile**) and other users' profiles (**User Details**)
- Loader, failure view with Retry button, and "no results" views
- Page Not Found route
- Fully responsive layout

**Extra features added on top of the core build**

| # | Feature | In one line |
| --- | --- | --- |
| 1 | Quick comment | The comment button adds a random positive comment, posted as the logged-in user |
| 2 | Share menu | The share button shows Facebook, X, WhatsApp, LinkedIn and Telegram icons that open in a new tab |
| 3 | Search suggestions | Typing in the search bar shows up to 3 matching suggestions, or none if nothing matches |
| 4 | Story ring and story viewer | Users who have a story get a highlighted ring; their name opens their profile, where their icon opens the story |

</details>

<details>
<summary><b>How each feature works</b> (step-by-step walkthroughs)</summary>

<br>

<details>
<summary>Authentication and protected routes</summary>

<br>

**What the user sees:** a login page with a username field, a password field and a Login button.

1. The user types a username and password and presses **Login**.
2. The app sends a `POST` request to the login API with the details as JSON.
3. **If the credentials are valid**, the API returns a `jwt_token`. The app saves it in a cookie named `jwt_token` (valid for 30 days) and sends the user to the Home page.
4. **If the credentials are wrong**, the API returns an `error_msg` (for example "Username is not found"). The app shows that message in red under the form.
5. Every other page is wrapped in a `ProtectedRoute`. It checks for the `jwt_token` cookie:
   - cookie present: the page opens
   - cookie missing: the user is redirected to `/login`
6. The reverse also applies: a user who is already logged in and opens `/login` is sent straight to Home.
7. **Logout** removes the cookie and sends the user back to `/login`.

Because the token lives in a cookie, the user stays logged in after a page refresh.

</details>

<details>
<summary>Home feed</summary>

<br>

**What the user sees:** the header, the stories bar, and below it a list of posts.

1. When Home opens, two separate requests go out: one for the stories and one for the posts. Each carries the saved token in an `Authorization: Bearer <token>` header.
2. While a request is running, that section shows a loader. When it succeeds, the data is shown. If it fails, a failure view appears with a **Retry** button that repeats only that request.
3. Each post shows the author's picture and name, the post image, the like/comment/share buttons, the likes count, the caption, the comments and how long ago it was posted.
4. Clicking the author's name opens that user's profile page.

</details>

<details>
<summary>Stories bar</summary>

<br>

**What the user sees:** a row of round story thumbnails with usernames underneath, which can be scrolled sideways using arrows.

1. The stories API returns a list of users with a story image each.
2. `UserStories` hands each story to the `UserStory` component and puts them inside a `react-slick` slider.
3. The slider adapts to screen size: it shows 7 stories on large screens and fewer on tablets and phones.
4. Clicking a thumbnail opens `UserStoriesModal`, a full-screen overlay showing the story image with the user's name and a close button. It closes with the close button, by clicking outside the story, or with the **Esc** key.

</details>

<details>
<summary>Liking and unliking posts</summary>

<br>

**What the user sees:** an empty heart that turns into a filled red heart when pressed, and a likes counter that changes with it.

1. Every post starts as "not liked" and shows the empty heart.
2. When the heart is pressed, the app flips the post to **liked**, shows the red heart and **adds 1** to the likes count immediately.
3. At the same time a `POST` request is sent with `{"like_status": true}`.
4. Pressing the red heart again flips the post back to **not liked**, shows the empty heart and **subtracts 1** from the count. The request is sent with `{"like_status": false}`.

The screen updates first and the request follows, so the heart reacts instantly with no waiting.

</details>

<details>
<summary>Commenting <i>(extra feature 1)</i></summary>

<br>

**What the user sees:** pressing the comment icon under a post adds a friendly comment to that post's comment list straight away.

1. The app holds a list of **10 positive comments** (for example, short compliments about the photo).
2. When the comment icon is pressed, one of the 10 is picked **at random**.
3. That comment is added to the end of the post's comments list. It appears under the **name of the logged-in user**, in the same style as the existing comments.
4. Pressing the icon again adds another random comment, and so on.

Only the post that was clicked changes. Other posts keep their own comments.

</details>

<details>
<summary>Sharing a post <i>(extra feature 2)</i></summary>

<br>

**What the user sees:** pressing the share icon opens a small menu with five icons: **Facebook, X, WhatsApp, LinkedIn and Telegram**.

1. The user presses the share icon under a post.
2. Five social icons appear.
3. The user presses one of them.
4. A **new browser tab** opens on that platform's share page, so the user can finish posting there.
5. The Insta Share tab stays open, so the user does not lose their place in the feed.

</details>

<details>
<summary>Searching posts and live suggestions <i>(extra feature 3)</i></summary>

<br>

**What the user sees:** a search box in the header. As they type, a short list appears under the box with matching words. Choosing one, or pressing the search icon, shows the matching posts.

**Live suggestions**

1. The user types a letter or a word.
2. The app compares the typed text against the available words and keeps the ones that match.
3. At most **3 suggestions** are shown, even if more words match.
4. If **nothing matches**, no suggestion list is shown at all, so the user never sees an empty box.
5. Choosing a suggestion fills the search box with that word.

**Searching**

1. The user presses the **search icon** (or Enter).
2. The header passes the text to the Home page.
3. Home sends it to `PostsList`, which requests `.../posts?search=<text>`.
4. While loading, a loader shows. The stories bar is hidden and a "Search Results" heading appears.
5. If posts match, they appear with all the usual actions (like, comment, share).
6. If no post matches, a **Search Not Found** view appears.
7. If the request fails, the failure view appears and **Retry** repeats the same search.
8. Clearing the search text and searching again returns to the normal feed with the stories bar.

**Searching from another page:** on profile pages the header has no access to the Home page's state. It instead navigates to Home and carries the typed text along, and Home picks it up and runs the search.

</details>

<details>
<summary>User profiles and story viewing <i>(extra feature 4)</i></summary>

<br>

**Story ring on the home page**

1. On the home page, every user who **has posted and has a story** shows their profile picture with a **highlighted circle (ring)** around it.
2. Users without a story show a plain picture with no ring, so you can tell at a glance who has something new.

**Opening a profile**

1. The user clicks a **name** on the home page.
2. The app goes to `/users/<user_id>`. The `UserDetails` page reads `user_id` from the URL, requests that user's profile and shows it.
3. The profile page shows the picture, name, bio, posts / followers / following counts, the user's previous stories as round thumbnails and a grid of their posts.

**Viewing the story**

1. On the profile page the user clicks the **profile icon** again.
2. The story opens in the story viewer overlay.
3. It closes with the close button, by clicking outside, or with **Esc**.

If the user has no posts, the page shows a camera icon with a **No Posts Yet** message instead of the grid.

</details>

<details>
<summary>My Profile</summary>

<br>

1. The user clicks **Profile** in the header and goes to `/my-profile`.
2. The app requests the logged-in user's details from the My Profile API.
3. `MyProfile` and `UserDetails` both use the same `Profile` layout component. Only the data source and the image `alt` texts differ ("my profile" / "my story" / "my post" versus "user profile" / "user story" / "user post").
4. A grid icon sits next to the **Posts** title above the posts grid.

</details>

<details>
<summary>Loading, failure and empty states</summary>

<br>

Every part of the app that fetches data handles the same three situations:

| State | What the user sees |
| --- | --- |
| Loading | A spinning loader in the middle of that section |
| Failure | A picture, a "Something went wrong" message and a **Try again** button that repeats only that request |
| Empty | A friendly message: "Search Not Found" for searches, "No Posts Yet" on profiles |

Stories, posts, My Profile and User Details each fetch on their own, so a failure in one never blocks the others.

</details>

<details>
<summary>Not Found page</summary>

<br>

Any address that is not one of the app's routes shows a Page Not Found screen with a **Home Page** button that returns to `/`.

</details>

<details>
<summary>Responsive design</summary>

<br>

- Layouts use CSS **media queries** instead of rendering the same elements twice.
- **Mobile:** the header collapses to the logo and a menu button. The menu opens to show the search box, Home and Profile links, and the Logout button.
- **Tablet and desktop (768px and up):** the header shows everything in one row, the stories slider shows more thumbnails, and profile pictures and post grids grow larger.
- **Login page:** the landing picture appears next to the form on wide screens (992px and up) and is hidden on small ones.

</details>

</details>

<details>
<summary><b>Routes</b></summary>

<br>

| Path | Component | Access |
| --- | --- | --- |
| `/login` | `LoginForm` | Public. Logged-in users are redirected to `/` |
| `/` | `Home` | Protected |
| `/my-profile` | `MyProfile` | Protected |
| `/users/:id` | `UserDetails` | Protected |
| `*` (anything else) | `NotFound` | Public |

</details>

<details>
<summary><b>API reference</b></summary>

<br>

Base URL: `https://apis.ccbp.in`

| Purpose | Method | Endpoint |
| --- | --- | --- |
| Login | POST | `/login` |
| Stories | GET | `/insta-share/stories` |
| Posts | GET | `/insta-share/posts` |
| Search posts | GET | `/insta-share/posts?search=<text>` |
| Like / unlike a post | POST | `/insta-share/posts/<postId>/like` with `{"like_status": true \| false}` |
| My profile | GET | `/insta-share/my-profile` |
| User profile | GET | `/insta-share/users/<userId>` |

All requests except login send `Authorization: Bearer <jwt_token>`.

</details>

<details>
<summary><b>Project structure</b></summary>

<br>

Every component lives in its own folder inside `src/components`, together with its own CSS file.

```
src/
├── App.jsx                     # Routes
├── App.css                     # Global styles
├── main.jsx                    # App entry point
├── index.css                   # Minimal page reset
└── components/
    ├── CommentSection/
    │   ├── CommentSection.jsx
    │   └── CommentSection.css
    ├── FailureView/
    ├── Header/
    ├── Home/
    ├── LoginForm/
    ├── MyProfile/
    ├── NotFound/
    ├── Post/
    ├── PostActions/
    ├── PostsList/
    ├── Profile/
    ├── ProtectedRoute/
    ├── UserDetails/
    ├── UserStories/
    ├── UserStoriesModal/
    └── UserStory/
```

</details>

<details>
<summary><b>Component guide</b></summary>

<br>

| Component | Responsibility |
| --- | --- |
| `LoginForm` | Login form, saves the token cookie, shows login errors |
| `ProtectedRoute` | Redirects to `/login` when there is no token |
| `Home` | Home page; holds the current search text |
| `Header` | Logo, search box with suggestions, Home / Profile links, Logout, mobile menu |
| `UserStories` | Fetches stories and shows them in the slider |
| `UserStory` | One round story thumbnail with the user's name |
| `UserStoriesModal` | Full-screen story viewer |
| `PostsList` | Fetches posts (or search results) and handles loading, failure and empty states |
| `Post` | One post card; holds its like state and likes count |
| `PostActions` | Like, comment and share buttons for a post |
| `CommentSection` | List of comments under a post |
| `MyProfile` | Fetches and shows the logged-in user's profile |
| `UserDetails` | Fetches and shows another user's profile, using the id in the URL |
| `Profile` | Shared profile layout used by both profile pages |
| `FailureView` | Reusable failure message with a Retry button |
| `NotFound` | 404 page |

</details>

<details>
<summary><b>Getting started</b></summary>

<br>

**Requirements:** Node.js 18 or newer and npm.

```bash
# 1. Clone the repository
git clone https://github.com/CowtaChiranjeevi/insta-share.git
cd insta-share

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open the address Vite prints in the terminal (usually `http://localhost:5173`). You will land on the login page.

**Other commands**

```bash
npm run build     # production build in /dist
npm run preview   # preview the production build locally
```

**Images:** the logo, login picture, failure picture, search-not-found picture and page-not-found picture are set in their component files (`Header`, `LoginForm`, `FailureView`, `PostsList`, `NotFound`). Point them at your own exported images.

</details>

<details>
<summary><b>Demo credentials</b></summary>

<br>

The practice API accepts several test accounts. You can log in with any one of the following:

| Username | Password |
| --- | --- |
| `aakash` | `sky@007` |
| `agastya` | `myth#789` |
| `advika` | `world@5` |
| `binita` | `modest*6` |
| `chetan` | `vigor$life` |
| `deepak` | `lightstar@1` |
| `harshad` | `joy@85` |
| `kapil` | `moon$008` |
| `rahul` | `rahul@2021` |
| `shravya` | `musical#stone` |
| `saira` | `princess@9` |

</details>

<details>
<summary><b>Testing hooks</b></summary>

<br>

The project follows a set of fixed attribute names so automated tests can find elements.

| Element | Attribute |
| --- | --- |
| Loader wrapper | `data-testid="loader"` |
| Header search button | `data-testid="searchIcon"` |
| Like button (not liked) | `data-testid="likeIcon"` |
| Unlike button (liked) | `data-testid="unLikeIcon"` |
| Post card | `data-testid="postItem"` |

Image `alt` texts: `website logo`, `website login`, `failure view`, `user story`, `post author profile`, `post`, `my profile`, `my story`, `my post`, `user profile`, `user post`, `search not found`, `page not found`.

</details>

<details>
<summary><b>Known limitations</b></summary>

<br>

- The practice API does **not save** likes, so liked posts and the likes count reset after a page refresh. The same applies to the quick comments from feature 1, which have no server endpoint.
- Share buttons open each platform's share page; whether a post is actually published depends on the user being signed in there.
- The app depends on the public practice API at `apis.ccbp.in`; if it is down, the failure views appear.

</details>

---

## Author

**Cowta Chiranjeevi**

- GitHub: [@CowtaChiranjeevi](https://github.com/CowtaChiranjeevi)

Designed, built and maintained by Cowta Chiranjeevi as a React portfolio project.
