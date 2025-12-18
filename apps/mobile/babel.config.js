module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          alias: {
            "@recepify/shared": "../packages/shared"
          }
        }
      ],
      "react-native-reanimated/plugin"
    ]
  };
};
