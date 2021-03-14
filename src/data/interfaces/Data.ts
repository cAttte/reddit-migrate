import {
    MultiRedditIcon,
    MultiRedditVisibility,
    MultiRedditWeightingSchema
} from "snoowrap/dist/objects/MultiReddit"

export interface Multireddit {
    name: string
    description: string
    visibility: MultiRedditVisibility
    icon_name: MultiRedditIcon
    key_color: string
    weighting_scheme: MultiRedditWeightingSchema
    copied_from: string
    subreddits: string[]
}

export default interface Data {
    exported_at?: string
    subscriptions: string[]
    follows: string[]
    friends: string[]
    blocked: string[]
    multireddits: Multireddit[]
    profile: Record<string, string>
    preferences: Record<string, string>
}
