import { request } from "../../request/index"
Page({
    data: {
        swiperList: [],
        catesList: [],
        floorsList: []
    },
    //options(Object)
    onLoad: function(options) {
        // var reqTask = wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     success: (result) => {
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     },
        //     fail: () => {},
        //     complete: () => {}
        // });
        this.getSwiperList();
        this.getCateList();
        this.getFloorList();

    },
    getSwiperList() {
        request({ url: '/home/swiperdata' })
            .then(result => {
                this.setData({
                    swiperList: result
                })
            })
    },
    getCateList() {
        request({ url: '/home/catitems' })
            .then(result => {
                this.setData({
                    catesList: result
                })
            })
    },
    getFloorList() {
        request({ url: '/home/floordata' })
            .then(result => {
                this.setData({
                    floorsList: result
                });
                this.modifyPath();
            })
    },
    modifyPath() {
        let { floorsList } = this.data;
        floorsList.forEach(v => {
            v.product_list.forEach(vc => {
                vc.navigator_url = vc.navigator_url.split('?')[1];
            })
        });
        this.setData({
            floorsList
        })
    }
});