FROM node:latest

RUN mkdir -p /home/nodejs

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的文件夹下
COPY . /home/nodejs

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd到 /home/nodeNestjs
WORKDIR /home/nodejs

# 安装项目依赖包
RUN npm install
RUN npx tsc

# 配置环境变量
ENV NODE_ENV=production

# 容器对外暴露的端口号(笔者的nestjs运行的端口号是3000)
EXPOSE 5000

# 容器启动时执行的命令，类似npm run start
CMD ["node", "/home/nodejs/dist/app.js"]

