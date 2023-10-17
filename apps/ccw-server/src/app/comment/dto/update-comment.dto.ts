import { OmitType, PartialType } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';

export class UpdateCommentDto extends PartialType( OmitType(Comment, ['createdAt','postId','userId'])) {}