import { Either, left, right } from "@/core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "./errors/not-alllowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface EditAnswerUseCaseRequest {
    authorId: string
    content: string
    answerId: string,
}

type EditAnswerUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError ,{
    answer: Answer
}>

export class EditAnswerUseCase {
    constructor(private answerRepository: AnswersRepository) { }

    async execute({
        authorId,
        content,
        answerId,
    }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {

        const answer = await this.answerRepository.findById(answerId)

        if(!answer){
            return left(new ResourceNotFoundError())
        }

        if(authorId !== answer.authorId.toString()){
            return left(new NotAllowedError())
        }

        answer.content = content

        await this.answerRepository.save(answer)

        return right({
            answer,
        })
    }
}
