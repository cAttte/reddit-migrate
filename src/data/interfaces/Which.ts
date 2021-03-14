import { Attributes, Submissions } from "./Attributes"

/**
 * <S> should be true if in a submission context. so, if the command being used is `purge`.
 */
type Which<S extends boolean = false> = Partial<
    Record<S extends true ? keyof typeof Submissions : keyof typeof Attributes, true>
>

export default Which
