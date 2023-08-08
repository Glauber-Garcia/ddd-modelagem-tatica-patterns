import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
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
      where:{
          id:entity.id,
      }
     }
     );
  }
  async find(id: string): Promise<Order> {
    const order = await OrderModel.findOne({where:{id}});
    const list : OrderItem[] = [];
    order.items.map((item) => {
      let i = new OrderItem(item.id, item.name,item.price,item.product_id,item.quantity);
      list.push(i);
    })
    return new Order(order.id,order.customer_id,list);
  }
  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll();
    const orders: Order[] = [];
    ordersModel.forEach(o => {
      let list : OrderItem[] = [];
      o.items.map((item) => {
        let i = new OrderItem(item.id, item.name,item.price,item.product_id,item.quantity);
        list.push(i);
      })
      let order =  new Order(o.id,o.customer_id,list);
      orders.push(order);
    });
    return orders;
  }
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
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
      include:[{model:OrderItemModel}],
    }
    );
  }
}
