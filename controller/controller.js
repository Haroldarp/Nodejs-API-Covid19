var controller = {

    get1: function(req, res){
        return res.status(200).send({
            mesage: "get1"
        });
    },

    get2: function(req, res){
        return res.status(200).send({
            mesage: "get2"
        });
    }

};

module.exports = controller;

