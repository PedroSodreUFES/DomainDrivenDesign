import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-alllowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachments } from "../../enterprise/entities/question-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditQuestionUseCaseRequest {
    authorId: string
    title: string
    content: string
    questionId: string,
    attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {
    question: Question
}>

export class EditQuestionUseCase {
    constructor(private questionRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionAttachmentsRepository
    ) { }

    async execute({
        authorId,
        title,
        content,
        questionId,
        attachmentsIds,
    }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {

        const question = await this.questionRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentQuestionAttachments =
            await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

        const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

        const questionAttachments = attachmentsIds.map(attachmentId => {
            return QuestionAttachments.create({
                attachmentId: new UniqueEntityID(attachmentId),
                questionId: question.id
            })
        })

        questionAttachmentList.update(questionAttachments)

        question.attachments = questionAttachmentList
        question.title = title
        question.content = content
        

        await this.questionRepository.save(question)

        return right({
            question
        })
    }
}
