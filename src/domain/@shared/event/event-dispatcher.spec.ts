
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendToLogWhenIsCreated1 from "../../customer/event/handler/send-to-log-when-is-created-1";
import SendToLogWhenIsCreated from "../../customer/event/handler/send-to-log-when-is-created-1";
import SendToLogWhenIsCreated2 from "../../customer/event/handler/send-to-log-when-is-created-2";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain event tests", () => {
  it("should register an event hadler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreateEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreateEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreateEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event hadler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreateEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreateEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreateEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event hadler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreateEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreateEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreateEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});