import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

function orderItemToDatabase(orderItem: OrderItem) {
  return {
    id: orderItem.id,
    productId: orderItem.productId,
    name: orderItem.name,
    price: orderItem.price,
    quantity: orderItem.quantity,
  };
}

export default class OrderRepository implements OrderRepositoryInterface {
	async update(entity: Order): Promise<void> {
		// const updatedItems = entity.items.map(orderItemToDatabase);
		// const itemsOnDB = await OrderItemModel.findAll({ where: { orderId: entity.id } });

		// for (const updatedItem of updatedItems) {
		// 	const itemExistsOnDB = itemsOnDB.find((itemOnDB) => itemOnDB.id === updatedItem.id);

		// 	if (!itemExistsOnDB) {
		// 		await OrderItemModel.create({ ...updatedItem, orderId: entity.id });
		// 	}
		// }

		// for (const itemOnDB of itemsOnDB) {
		// 	const itemExistsOnUpdatedItems = updatedItems.find((updatedItem) => updatedItem.id === itemOnDB.id);

		// 	if (!itemExistsOnUpdatedItems) {
		// 		await OrderItemModel.destroy({ where: { id: itemOnDB.id } });
		// 	}
		// }

		await OrderModel.update({ total: entity.total() }, { where: { id: entity.id } });
	}
  async find(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });
    const list: OrderItem[] = [];
    order.items.map((item) => {
      let i = new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );
      list.push(i);
    });
    return new Order(order.id, order.customer_id, list);
  }

  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: [OrderItemModel], // Inclua os itens do pedido na consulta
    });

    const orders: Order[] = ordersModel.map((orderModel) => {
      const orderItems: OrderItem[] = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        );
      });

      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });

    return orders;
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
