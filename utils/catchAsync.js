// function to wrap async functions and catch errors
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}