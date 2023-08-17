
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import { CustomerChangedAddressEvent } from "../customer-changed-address.event";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendToLogWhenIsChangedAdress implements EventHandlerInterface<CustomerChangedAddressEvent>{
	handle(event: CustomerChangedAddressEvent): void {
		const { id, name, oldAddress, newAddress } = event.eventData.customer;

		console.log(`Endereco do cliente ${id},${name} alterado para: ${newAddress.street} ${newAddress.number}, ${newAddress.city} - ${newAddress.zip}`);
	}

    
}