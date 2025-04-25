import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-alllowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe("Edit Answer", () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(inMemoryAnswersRepository)
    })


    it('should be able to edit a question', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            authorId: "author-1",
            content: "Conteúdo teste",
            answerId: newAnswer.id.toString()
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: "Conteúdo teste",
        })
    })

    it('should not be able to edit a question from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))

        inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            authorId: "author-2",
            content: "Conteúdo teste",
            answerId: newAnswer.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})