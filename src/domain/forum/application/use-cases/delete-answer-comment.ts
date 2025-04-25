import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-alllowed-error'

interface DeleteAnswerCommentsUseCaseRequest {
    authorId: string
    answerCommentId: string
}

type DeleteAnswerCommentsUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>

export class DeleteAnswerCommentsUseCase {
    constructor(
        private answerCommentsRepository: AnswerCommentsRepository,
    ) { }

    async execute({
        authorId,
        answerCommentId,
    }: DeleteAnswerCommentsUseCaseRequest): Promise<DeleteAnswerCommentsUseCaseResponse> {
        const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

        if (!answerComment) {
            return left(new ResourceNotFoundError())
        }

        if (answerComment.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        await this.answerCommentsRepository.delete(answerComment)

        return right({})
    }
}