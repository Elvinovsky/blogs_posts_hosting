"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const in_memory_1 = require("../../database/in-memory");
exports.blogsRepository = {
    //тестовое удаление базы данных о блогах.
    testingDeleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return in_memory_1.inMemory.allBlogs = [];
        });
    },
    //все существующие блоги.
    returnOfAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return in_memory_1.inMemory.allBlogs;
        });
    },
    //создание и добавление нового блога.
    addNewBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const createBlog = {
                id: (+(new Date())).toString(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            in_memory_1.inMemory.allBlogs.push(createBlog);
            return createBlog;
        });
    },
    //поиск и возврат блога по ID.
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return in_memory_1.inMemory.allBlogs.find(el => el.id === id);
        });
    },
    //обновление блога по айди.
    updateBlogById(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.findBlogById(id)) {
                in_memory_1.inMemory.allBlogs.forEach(el => {
                    el.name = name;
                    el.description = description;
                    el.websiteUrl = websiteUrl;
                });
                return true;
            }
            return false;
        });
    },
    //поиск блога по ID для удаления.
    searchBlogByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = in_memory_1.inMemory.allBlogs.findIndex(b => b.id === id);
            if (index > -1) {
                in_memory_1.inMemory.allBlogs.splice(index, 1);
                return true;
            }
            return false;
        });
    }
};
