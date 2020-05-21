import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },

    onShow: function() {
        const address = wx.getStorageSync("address");
        let cart = wx.getStorageSync("cart") || [];
        // const allChecked = cart.length ? cart.every(v => v.checked) : false;
        cart = cart.filter(v => v.checked);
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(element => {
            totalPrice += element.num * element.goods_price;
            totalNum += element.num;
        });
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        });
    },


    async handleOrderPay() {
        try {
            const token = wx.getStorageSync("token");
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index'
                });
                return;
            }
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.all;
            const cart = this.data.cart;
            let goods = [];
            cart.forEach(v => goods.push({
                goods_id: v.goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }))
            const orderParams = { order_price, consignee_addr, goods };
            //  准备发送请求 创建订单 获取订单编号
            const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
            //  发起 预支付接口
            const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
            //  发起微信支付 
            await requestPayment(pay);
            //  查询后台 订单状态
            const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
            await showToast({ title: "支付成功" });
            //  手动删除缓存中 已经支付了的商品
            let newCart = wx.getStorageSync("cart");
            newCart = newCart.filter(v => !v.checked);
            wx.setStorageSync("cart", newCart);

            //  支付成功了 跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/index'
            });

        } catch (error) {
            await showToast({ title: "支付失败" })
            console.log(error);
        }
    }
})