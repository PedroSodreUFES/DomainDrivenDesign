import { DomainEvent } from '../events/domain-event'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { AgreggateRoot } from '../entities/aggregate-root'
import { DomainEvents } from '@/core/events/domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date
    private aggregate: CustomAggregate // eslint-disable-line

    constructor(aggregate: CustomAggregate) {
        this.aggregate = aggregate
        this.ocurredAt = new Date()
    }

    public getAggregateId(): UniqueEntityID {
        return this.aggregate.id
    }
}

class CustomAggregate extends AgreggateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null)

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

        return aggregate
    }
}

describe("Domain events", () => {
    it("should be able to dispatch and listen to events", () => {
        const callbackSpy = vi.fn()
        
        // Subscriber cadastrado = ouvindo o evento da resposta criada
        DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

        // criar uma respostam SEM salvar no banco
        const aggregate = CustomAggregate.create()

        // assegurando que o evento foi criado porém não foi disparado
        expect(aggregate.domainEvents).toHaveLength(1)

        // salvando a resposta no banco de dados e assim disparar o evento
        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        // O subscriber ouve o evento e faz o que precisa ser feito com o dado
        expect(callbackSpy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})