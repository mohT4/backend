exports.getUser = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'welcome to the user route',
  });
};
