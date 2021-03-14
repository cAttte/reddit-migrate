import { Attributes, Submissions } from "./Attributes"

type Which<S extends boolean = false> = Partial<
    Record<S extends true ? keyof typeof Submissions : keyof typeof Attributes, true>
>
export default Which
