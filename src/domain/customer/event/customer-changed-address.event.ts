import EventInterface from "../../@shared/event/event.interface";

interface Address {
  street: string;
  number: string;
  city: string;
  zip: string;
}

interface CustomerChangedAddressEventPayload {
  customer: {
    id: string;
    name: string;
    oldAddress: Address;
    newAddress: Address;
  }
}

export class CustomerChangedAddressEvent implements EventInterface {
    dataTimeOccured: Date;
    eventData: CustomerChangedAddressEventPayload;
	constructor(eventPayload: CustomerChangedAddressEventPayload) {
		this.dataTimeOccured = new Date();
		this.eventData = eventPayload;
	}

   
}