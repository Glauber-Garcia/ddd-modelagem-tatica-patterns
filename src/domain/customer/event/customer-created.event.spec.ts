import SendToLogWhenIsCreated1 from "./handler/send-to-log-when-is-created-1";
import SendToLogWhenIsCreated2 from "./handler/send-to-log-when-is-created-2";
import CustomerCreatedEvent from "./customer-created.event";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Customer created event tests", () => {
	it("should notify the event handlers of the creation of a product", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler1 = new SendToLogWhenIsCreated1();
		const eventHandler2 = new SendToLogWhenIsCreated2();

		const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
		const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

		eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
		eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

		expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
		const eventPayload = {
			customer: {
				id: "123",
				name: "John Doe",
				active: false
			}			
		};

		const customerCreatedEvent = new CustomerCreatedEvent(eventPayload);

		eventDispatcher.notify(customerCreatedEvent);

		expect(spyEventHandler1).toHaveBeenCalled();
		expect(spyEventHandler2).toHaveBeenCalled();
	});

});