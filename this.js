let user = {
    a: 2,
    b: 3,
    findMultiply: function() {
        ((a, b) => {
            console.log(this === user)
            console.log(a + b)
        })
        (this.a, this.b)
    }
}

user.findMultiply()