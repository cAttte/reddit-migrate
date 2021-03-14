enum Attributes {
    "subscriptions",
    "follows",
    "friends",
    "blocked",
    "multireddits",
    "profile",
    "preferences"
}

type Submission = "post" | "comment"
enum Submissions {
    "posts",
    "comments"
}

export { Attributes, Submission, Submissions }
