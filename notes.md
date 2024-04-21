# Things to work on:-

1. Multiple images in content and video also run ✅
2. During registration take username and create user collection by passing a default profile pic ✅
3. Id of each document of Users collection must correspond to the id of user in auth that we got after registering the user. & update home with user details taken from user collection. ✅
4. Settings & Followers. ✅
5. Following. ✅
6. For you & Following & Infinite Scrolling
7. Profile
8. Edit ✅
9. Search
10. Settings
11. Comments
12. Likes
13. Retweet
14. Tags/Hashtags
15. Bookmarks
16. How to show tweets randomly
17. show full image

// when user clicks on any other person profile then that other person profile must be open work on that as well.

// Media

# Learnings:-

1. Always, remember as we have access to the id of the currently logged in user so it is important to work with username in case of fetching data from Users or anyother collection that needs specific user data.
2. profileSrc and coverSrc is not working properly during initial rendering in Profile.jsx
<!-- so, The issue with `profileSrc` and `coverSrc` not working properly during the initial rendering could be due to the following reasons:


3. **Timing of Data Availability**: During the initial rendering, if the data required to fetch profile and cover images (`userData` and `userDetails`) are not available immediately, the functions responsible for fetching these images might execute before the data is retrieved. This can lead to `profileSrc` and `coverSrc` being set to empty strings or incorrect values.

4. **Dependency Management in useEffect**: If the `useEffect` hook responsible for fetching profile and cover images is not properly managing its dependencies, it might execute before `userData` and `userDetails` are updated with the correct values. As a result, `profileSrc` and `coverSrc` might not be set correctly.

To address this issue, you should ensure that:

- Data dependencies (`userData` and `userDetails`) are properly managed in the `useEffect` hook. This ensures that the hook executes only when the required data is available.
- Handle the scenario where the required data is not immediately available during the initial rendering. You can use conditional rendering or loading indicators to handle this scenario gracefully.

By properly managing data dependencies and handling timing issues, you can ensure that `profileSrc` and `coverSrc` are set correctly during the initial rendering of the component.
--> 3. To show latest uploaded docs we can use orderDesc("$createdAt") also remember to mention the createdAt attr in index. 4. In settings conditionally rendering functionalities is becoming difficult so I sent the data from parent component so that setting component will already have that data. 4. To close a component if clicked outside of it:-

useEffect(() => {
// Function to close the sidebar when clicking outside of it
const handleClickOutside = (event) => {
if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
setShowMenu(false);
}
};

    // Add event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };

}, []);
const sidebarRef = useRef(null);

// settings

// It is always to better to setup a redux store and store data their so that after performing every opereation on server we can update store and automatically everywhere changes will take place as all the components that are subscribed to that slice will get updated. Realized when performing delete operation on tweet.

// Deleting of tweets and comments by looping and first getting all docs and then deleteing them one by one.
// responsiveness
