import EventDispatcher from "../../@shared/event/event-dispatcher";
import { CustomerChangedAddressEvent } from "./customer-changed-address.event";
import SendToLogWhenIsChangedAdress from "./handler/send-to-log-when-is-changed-address";

describe("Customer changed of address event tests", () => {
	it("should notify the event handlers of the change of address of a customer", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler1 = new SendToLogWhenIsChangedAdress();

		const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");

		eventDispatcher.register("CustomerChangedAddressEvent", eventHandler1);

		expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);

		const eventPayload = {
			customer: {
				id: "123",
				name: "John Doe",
				oldAddress: {
					street: "Old Street",
					number: "123",
					city: "Old City",
					zip: "12345"
				},
				newAddress: {
					street: "New Street",
					number: "473",
					city: "New City",
					zip: "54321"
				}
			}			
		};

		const customerCreatedEvent = new CustomerChangedAddressEvent(eventPayload);

		eventDispatcher.notify(customerCreatedEvent);

		expect(spyEventHandler1).toHaveBeenCalled();
	});

});