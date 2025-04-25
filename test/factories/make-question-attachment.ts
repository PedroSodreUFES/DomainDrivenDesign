import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachments, QuestionAttachmentProps } from "@/domain/forum/enterprise/entities/question-attachment";

export function makeQuestionAttachment(
    override: Partial<QuestionAttachmentProps> = {},
    id?: UniqueEntityID,
) {
    const questionAttachment = QuestionAttachments.create(
        {
            questionId: new UniqueEntityID(),
            attachmentId: new UniqueEntityID(),
            ...override,
        },
        id,
    )
    
    return questionAttachment;
}