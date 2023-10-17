import { PickType } from "@nestjs/swagger"
import { Comment } from '../entities/comment.entity';


export class CreateCommentDto extends PickType(Comment,['postId','userId','content'] as const){}