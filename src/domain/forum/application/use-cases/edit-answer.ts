import { Either, left, right } from "@/core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "../../../../core/errors/errors/not-alllowed-error"
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error"
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list"
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository"
import { AnswerAttachments } from "../../enterprise/entities/answer-attachment"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface EditAnswerUseCaseRequest {
    authorId: string
    content: string
    answerId: string,
    attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {
    answer: Answer
}>

export class EditAnswerUseCase {
    constructor(private answerRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) { }

    async execute({
        authorId,
        content,
        answerId,
        attachmentsIds,
    }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {

        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentAnswerAttachments =
            await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

        const answerAttachments = attachmentsIds.map(attachmentId => {
            return AnswerAttachments.create({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id
            })
        })

        answerAttachmentList.update(answerAttachments)

        answer.attachments = answerAttachmentList

        answer.content = content

        await this.answerRepository.save(answer)

        return right({
            answer,
        })
    }
}
