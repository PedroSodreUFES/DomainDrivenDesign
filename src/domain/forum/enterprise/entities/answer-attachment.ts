import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface AnswerAttachmentProps {
    answerId: UniqueEntityID
    attachmentId: UniqueEntityID
}

export class AnswerAttachments extends Entity<AnswerAttachmentProps> {
    get answerId() {
        return this.props.answerId
    }

    get attachmentId() {
        return this.props.attachmentId
    }

    static create(props: AnswerAttachmentProps, id?: UniqueEntityID){
        const answerAttachment = new AnswerAttachments(props, id)

        return answerAttachment
    }
}