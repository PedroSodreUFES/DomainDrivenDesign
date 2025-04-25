import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachments, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachment(
    override: Partial<AnswerAttachmentProps> = {},
    id?: UniqueEntityID,
) {
    const answerAttachment = AnswerAttachments.create(
        {
            answerId: new UniqueEntityID(),
            attachmentId: new UniqueEntityID(),
            ...override,
        },
        id,
    )
    
    return answerAttachment;
}