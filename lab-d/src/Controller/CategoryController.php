<?php

namespace App\Controller;
use App\Exception\NotFoundException;
use App\Model\Category;
use App\Service\Router;
use App\Service\Templating;
class CategoryController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $categories = Category::findAll();
        $html = $templating->render('category/index.html.php', [
            'categories' => $categories,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $category = Category::fromArray($requestPost);
            // @todo missing validation
            $category->save();

            $path = $router->generatePath('category-index');
            $router->redirect($path);
            return null;
        } else {
            $category = new Category();
        }

        $html = $templating->render('category/create.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
        return $html;
    }
    public function editAction($id, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $category = Category::find($id);
        if (! $category) {
            throw new NotFoundException();
        }

        if ($requestPost) {
            $category->fill($requestPost);
            // @todo missing validation
            $category->save();

            $path = $router->generatePath('category-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('category/edit.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
        return $html;
    }
    public function showAction($id, Templating $templating, Router $router): ?string
    {
        $category = Category::find($id);
        if (! $category) {
            throw new NotFoundException();
        }

        $html = $templating->render('category/show.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction($id, Templating $templating, Router $router): ?string
    {
        $category = Category::find($id);
        if (! $category) {
            throw new NotFoundException();
        }

        $category->delete();
        $path = $router->generatePath('category-index');
        $router->redirect($path);
        return null;
    }
}