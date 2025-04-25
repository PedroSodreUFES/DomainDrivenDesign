import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "./errors/not-alllowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface EditQuestionUseCaseRequest {
    authorId: string
    title: string
    content: string
    questionId: string,
}

type EditQuestionUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError ,{
    question: Question
}>

export class EditQuestionUseCase {
    constructor(private questionRepository: QuestionsRepository) { }

    async execute({
        authorId,
        title,
        content,
        questionId,
    }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {

        const question = await this.questionRepository.findById(questionId)

        if(!question){
            return left(new ResourceNotFoundError())
        }

        if(authorId !== question.authorId.toString()){
            return left(new NotAllowedError())
        }

        question.title = title
        question.content = content

        await this.questionRepository.save(question)

        return right({
            question
        })
    }
}
