import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from "../repositories/TransactionsRepository";

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === "outcome" && total < value) {
      throw new AppError("You do not have enough balance");
    }

    // Verificar se a categoria já existe
    // Existe? Buscar ela no banco de dados e usar o id que foi retornado
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      }
    });

    if (!transactionCategory) {
      // Não existe? Crio ela
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    })

    await transactionsRepository.save(transaction)

    return transaction;
  }
}

export default CreateTransactionService;
