import { PickType } from "@nestjs/swagger";
import { Upvote } from "../entities/upvote.entity";

export class CreateUpvoteDto extends PickType(Upvote,['postId'] as const) {}
