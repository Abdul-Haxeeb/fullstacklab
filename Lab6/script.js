
async function getUser(id) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
    );

    if (!response.ok) {
        throw new Error("User fetching failed");
    }

    const user = await response.json();

    if (!user.id || !user.name || !user.email) {
        throw new Error("Invalid user details");
    }

    return user;
}

async function getPosts(id) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${id}`
    );

    if (!response.ok) {
        throw new Error("Posts fetching failed");
    }

    const posts = await response.json();

    if (!Array.isArray(posts) || posts.length === 0) {
        throw new Error("Invalid posts details");
    }

    for (const post of posts) {
        if (!post.id || !post.title || !post.body) {
            throw new Error("Invalid post data");
        }
    }

    return posts;
}

async function getAllDetails(id) {
    const results = await Promise.all([
        getUser(id),
        getPosts(id)
    ]);

    const user = results[0];
    const posts = results[1];

    if (!user || !user.id || !user.name || !user.email ||
        !Array.isArray(posts) || posts.length === 0) {
        throw new Error("Both operations must return valid data");
    }

    return { user, posts };
}

getUser(1)
    .then(user => console.log("Valid user:", user))
    .catch(error => console.log("Error:", error.message));

getAllDetails(1)
    .then(details => console.log("Both operations successful:", details))
    .catch(error => console.log("Promise rejected:", error.message));
