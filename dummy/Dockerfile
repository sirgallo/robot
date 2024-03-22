FROM buildapi

COPY core ./core
COPY dummy ./dummy

RUN npm run build:all

EXPOSE 2468

CMD ["npm", "run", "start:dummy"]