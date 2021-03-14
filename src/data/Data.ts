export interface Multireddit {
    name: string
    description: string
    over_18: boolean
    visibility: string
    key_color: string
    copied_from: string
    subreddits: string[]
}

export default interface Data {
    subscriptions: string[]
    follows: string[]
    friends: string[]
    blocked: string[]
    multireddits: Multireddit[]
    profile: Record<string, string>
    preferences: Record<string, string>
}
