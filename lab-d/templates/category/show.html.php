
<?php

/** @var \App\Model\Category $category */
/** @var \App\Service\Router $router */

$title = 'Category Details';
$bodyClass = 'show';

ob_start(); ?>
<h1><?= htmlspecialchars($category->getName() ?? '', ENT_QUOTES, 'UTF-8') ?></h1>
<article>
    <p>ID: <?= $category->getId() ?></p>
    <p>Name: <?= htmlspecialchars($category->getName() ?? '', ENT_QUOTES, 'UTF-8') ?></p>
</article>

<ul class="action-list">
    <li>
        <a href="<?= $router->generatePath('category-index') ?>">Back to list</a>
    </li>
    <li>
        <a href="<?= $router->generatePath('category-edit', ['id' => $category->getId()]) ?>">Edit</a>
    </li>
</ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
