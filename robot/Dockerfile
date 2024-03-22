FROM buildapi

COPY core ./core
COPY robot ./robot
COPY robot/public ./public

RUN npm run build:all

EXPOSE 1234

CMD ["npm", "run", "start:robot"]