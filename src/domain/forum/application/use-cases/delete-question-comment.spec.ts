import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comment-repository'
import { DeleteQuestionUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-alllowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionUseCase

describe('Delete question comment', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentsRepository()

        sut = new DeleteQuestionUseCase(
            inMemoryQuestionCommentsRepository,
        )
    })

    it('should be able to delete a question comment', async () => {
        const questionComment = makeQuestionComment()

        await inMemoryQuestionCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })

        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question comment from another user.', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID('author-1')
        })

        await inMemoryQuestionCommentsRepository.create(questionComment)

        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})