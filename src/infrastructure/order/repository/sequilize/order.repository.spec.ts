import OrderRepository from "./order.repository";
import OrderModel from "./order.model";
import CustomerModel from "../../../customer/repository/sequilize/customer.model";
import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import ProductModel from "../../../product/repository/sequilize/product.model";
import ProductRepository from "../../../product/repository/sequilize/product.repository";
import CustomerRepository from "../../../customer/repository/sequilize/customer.repository";
import OrderItemModel from "./order-item.model";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      OrderModel,
      CustomerModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  function getCustomerWithAddress() {
    const customer = new Customer("123", "John Doe");
    const address = new Address("Wilkie Way", 4290, "94306", "Palo Alto, CA");
    customer.changeAddress(address);

    return customer;
  }

  it("should create a order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = getCustomerWithAddress();
    await customerRepository.create(customer);

    const product1 = new Product("23", "Shoes", 259.99);
    const product2 = new Product("24", "Shirt", 89.99);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      "247",
      "Order Item 1",
      product1.price,
      product1.id,
      1
    );
    const orderItem2 = new OrderItem(
      "248",
      "Order Item 2",
      product2.price,
      product2.id,
      2
    );

    const order = new Order("329", customer.id, [orderItem1, orderItem2]);

    await orderRepository.create(order);

    const orderFromDB = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderFromDB?.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          product_id: orderItem1.productId,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order.id,
        },
        {
          id: orderItem2.id,
          product_id: orderItem2.productId,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: order.id,
        },
      ],
    });
  });

  it("should update items and the total of an order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = getCustomerWithAddress();
    await customerRepository.create(customer);

    const product1 = new Product("23", "Shoes", 259.99);
    const product2 = new Product("24", "Shirt", 89.99);
    const product3 = new Product("25", "Pack of socks", 19.99);

    await productRepository.create(product1);
    await productRepository.create(product2);
    await productRepository.create(product3);

    const orderItem1 = new OrderItem(
      "247",
      "Order Item 1",
      product1.price,
      product1.id,
      1
    );
    const orderItem2 = new OrderItem(
      "248",
      "Order Item 2",
      product2.price,
      product2.id,
      2
    );

    const order = new Order("329", customer.id, [orderItem1, orderItem2]);

    await orderRepository.create(order);

    const orderItem3 = new OrderItem(
      "249",
      "Order Item 3",
      product3.price,
      product3.id,
      1
    );

    order.addItem(orderItem3);

    await orderRepository.update(order);

    const orderFromDB = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderFromDB?.items.length).toBe(2);
    expect(orderFromDB?.total).toBe(order.total());

    order.removeItem(orderItem1.id);
    order.removeItem(orderItem2.id);

    await orderRepository.update(order);

    const orderFromDB2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderFromDB2?.items.length).toBe(2);
    expect(orderFromDB2?.total).toBe(order.total());
  });

  it("should throw an error when customer is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("973");
    }).rejects.toThrow("SQLITE_MISUSE: Database handle is closed");
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = getCustomerWithAddress();
    await customerRepository.create(customer);

    const product1 = new Product("23", "Shoes", 259.99);
    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "256",
      "Order Item 1",
      product1.price,
      product1.id,
      1
    );
    const order = new Order("332", customer.id, [orderItem1]);
    await orderRepository.create(order);

    const orderFound = await orderRepository.find(order.id);

    expect(orderFound).toEqual(order);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer = getCustomerWithAddress();
    await customerRepository.create(customer);

    const product1 = new Product("23", "Shoes", 259.99);
    const product2 = new Product("24", "Shirt", 89.99);
    const product3 = new Product("25", "Pack of socks", 19.99);

    await productRepository.create(product1);
    await productRepository.create(product2);
    await productRepository.create(product3);

    const orderItem1 = new OrderItem(
      "247",
      "Order Item 1",
      product1.price,
      product1.id,
      1
    );
    const orderItem2 = new OrderItem(
      "248",
      "Order Item 2",
      product2.price,
      product2.id,
      2
    );
    const orderItem3 = new OrderItem(
      "249",
      "Order Item 3",
      product3.price,
      product3.id,
      1
    );

    const order1 = new Order("329", customer.id, [orderItem1, orderItem2]);
    const order2 = new Order("330", customer.id, [orderItem3]);

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders.length).toBe(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});
