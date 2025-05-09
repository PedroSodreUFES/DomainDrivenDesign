import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachments } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
    public items: QuestionAttachments[] = []

    async findManyByQuestionId(questionId: string) {
        const questionAttachments = this.items
            .filter((item) => item.questionId.toString() === questionId)

        return questionAttachments
    }

    async deleteManyByQuestionId(questionId: string): Promise<void> {
        const questionAttachments = this.items
            .filter((item) => item.questionId.toString() !== questionId)

        this.items = questionAttachments
    }
}